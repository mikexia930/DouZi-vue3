const _ = require('lodash');
const { default: googleTranslate } = require('google-translate-open-api');
const { readFileSync, writeFileSync, promises: fsp } = require('fs');
const path = require('path');

function readJsonFile(path) {
  try {
    return JSON.parse(readFileSync(path).toString());
  } catch (e) {
    return {};
  }
}

function writeJsonFile(path, obj) {
  writeFileSync(path, JSON.stringify(obj, null, 2), _.noop);
}

/**
 * 构造 i18n 的 key
 * @param obj 源
 * @param parentKeys 递归用
 * @param allKeys
 */
function buildKeys(obj, parentKeys = [], allKeys = []) {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    const value = obj[key];
    const pk = [...parentKeys].concat(key);
    if (_.isObject(value)) {
      buildKeys(value, pk, allKeys);
    } else {
      allKeys.push(pk.join('.'));
    }
  });
  return allKeys;
}

/**
 * 调用翻译 API
 * @param sourceObj 源 i18n 对象
 * @param translateKeys 需要翻译的 key
 * @param locale 语言
 * @returns {Promise<{}>}
 */
async function translateApi(sourceObj, translateKeys, locale) {
  const valuesAdded = translateKeys.map(k => _.get(sourceObj, k));
  const translatedObj = {};
  if (valuesAdded.length) {
    const result = await googleTranslate(valuesAdded, {
      tld: 'cn',
      to: locale,
      client: 'dict-chrome-ex'
    });
    const translatePhrases =
      valuesAdded.length > 1
        ? result.data.map(([tr]) => tr.replace(/<i>(.*?)<\/i> <b>(.*?)<\/b>/g, '$2'))
        : [result.data.sentences[0].trans];
    translatePhrases.forEach((phrase, index) => {
      _.set(translatedObj, translateKeys[index], phrase);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return translatedObj;
}

/**
 * 翻译
 * @param localePath 路径
 * @param sourceFile 源
 * @param distConfig 配置
 * @returns {Promise<void>}
 */
async function translate(localePath, sourceFile, distConfig) {
  const sourceObj = readJsonFile(path.join(localePath, sourceFile));
  const allKeys = buildKeys(sourceObj);

  for (const config of distConfig) {
    const distPath = path.join(localePath, config.fileName);
    const targetObj = readJsonFile(distPath);
    const diffKeys = allKeys.filter(k => !_.get(targetObj, k));

    const translatedObj = await translateApi(sourceObj, diffKeys, config.locale);

    const distObj = {};
    const rParams = /\{.*?}/g;
    allKeys.forEach(k => {
      const sourceValue = _.get(sourceObj, k);
      const newValue = _.get(targetObj, k) || _.get(translatedObj, k) || '';
      const matchParams = sourceValue.match(rParams);
      if (matchParams && matchParams.length === 1) {
        let i = 0;
        _.set(
          distObj,
          k,
          newValue.replace(rParams, () => matchParams[i++])
        );
      } else {
        _.set(distObj, k, newValue);
      }
    });
    writeJsonFile(distPath, distObj);
  }
}

/**
 * 遍历文件夹
 * @param dir
 * @returns {any}
 */
async function* walk(dir) {
  for await (const d of await fsp.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield [dir, d.name];
  }
}

async function main() {
  const sourceFile = 'zh_CN.json';

  const targetConfigs = [
    {
      locale: 'en',
      fileName: 'en.json'
    }
    /*
    {
      locale: 'zh-TW',
      fileName: 'zh_TW.json'
    },
    {
      locale: 'ja',
      fileName: 'jp.json'
    },
    */
  ];

  const pathSet = new Set();
  for await (const [dir, name] of walk('src')) {
    if (name === sourceFile) {
      pathSet.add(dir);
    }
  }
  for (const localePath of pathSet) {
    try {
      await translate(localePath, sourceFile, targetConfigs);
      console.log(localePath, 'finished');
    } catch (err) {
      console.log(err);
    }
  }
  return pathSet.size;
}

main().then(c => {
  console.log('total modules:', c);
});
