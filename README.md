# 豆子 （DouZi）vue3
前端快速开发基础框架，基于 vue 已配置路由、 request请求、多语言，整合增强组件时间选择器、表格。

### 技术选型
* [node ^15](https://nodejs.org/en/docs/)
* [nvm](https://github.com/nvm-sh/nvm)
* [typescript](https://www.typescriptlang.org/docs/)
* [vite3](https://vitejs.dev/guide/)
* [vue3](https://vuejs.org/guide/introduction.html)
* [vue-router](https://router.vuejs.org/zh/guide/)
* [vue-i18n](https://kazupon.github.io/vue-i18n/guide/formatting.html)
* [tailwindcss](https://tailwindcss.com/docs/installation)
* [less](https://lesscss.org/usage/)
* [antdv3](https://antdv.com/components/overview)
* [x-request-pool](https://github.com/mikexia930/xRequestPool)
* [x-datetime-picker](https://github.com/mikexia930/xDatetimePicker3)
* [x-table](https://github.com/mikexia930/xTable)
* [mockjs](https://github.com/nuysoft/Mock)
* [prettier](https://prettier.io/docs/en/index.html)

### 使用说明
注意 node 的版本
#### 安装
```
npm install
```

#### 运行
```
npm run dev
```

### 文件夹说明
```
./src
--/assets
----/css
------/antd.less        # antd 的样式重置
------/base.less        # 全局样式，含 tailwind
------/theme_x.less     # 主体样式，配合 vite.config.ts 里的配置使用
--/common               # 全局使用
----/components         # 全局组件
------/datePicker       # 日期选择 使用方法参考 https://github.com/mikexia930/xDatetimePicker3
------/table            # 表格组件 使用方法参考 https://github.com/mikexia930/xTable
------/elements         # antdv 的组件壳，集中管理第三方组件，便于切换为其它，例如，element；保证已使用的属性方法一致就可以替换。
----/libs               # 全局方法库
------/lodashLib.ts     # lodash 库的统一 import/exprot
------/numberLib.ts     # 数字相关的常用方法
----/locals             # 全局的语言包，可自行配置
----/requests           # 请求库
------/config.ts        # 常规配置和 ts 接口枚举设置
------/http.ts          # http 封装 使用方法参考 https://github.com/mikexia930/xRequestPool
------/socket.ts        # socket 封装 可参考 https://github.com/mikexia930/xWebsocket
----/stores             # 全局的 reactive, 可根据业务需要，自行扩展不同的 reactive store
------/socketCommon.ts  # 全局使用的响应数据
----/i18n               # 多语言
------/locales          # 语言包的集中载入入口，每增加一个新的语言需要这里配置下载入
------/i18n.ts          # vue-i18n 的配置
------/lib.ts           # 语言相关的方法库
----/router             # 路由
------/index.ts         # 路由配置
------/routes.ts        # 具体的路由地址
----/modules            # 具体的功能应用
------/index            # 例子功能
--------/components     # 当前功能使用特有的组件
--------/config         # 当前功能的配置
--------/locales        # 当前功能的语言包
--------/mocks          # mock 配置
--------/requets        # 当前功能的所有请求
--------/ModuleIndex.vue# 当前功能的入口
----/views              # 路由的模版文件
------/index            # index 功能的入口
------/none             # 页面不存在的模版
```

### dev proxy 配置
可设置一个开发服特有 path，例如: dev_api，然后配置下 vite.config,把所有带特有 path 的请求都转发下。

1.配置本地的.env.local
```
VITE_APP_HTTP_HOST=http://localhost:3000 # http地址
VITE_APP_HTTP_URL=/dev_api # 路径
VITE_APP_SOCKET_HOST=ws://localhost:3000 # socket地址
VITE_APP_SOCKET_URL=/dev_socket # 路径
```
2.配置 vite.config.ts
```
server: {
  host: '0.0.0.0',
  port: 3000,
  proxy: {
    '/dev_api': {
      target: 'http://dev.domain.com', // proxy 的 http 接口地址
      changeOrigin: true,
      rewrite: path => path.replace(/^\/dev_api/, '/')
    },
    '/dev_socket': {
      target: 'ws://dev.domain.com', // proxy 的 socket 接口地址
      ws: true,
      changeOrigin: true, //是否允许跨域
      rewrite: path => path.replace(/^\/dev_socket/, '/')
    }
  }
}
```
更多配置参考[官方文档](https://cn.vitejs.dev/config/server-options.html)

### mock 配置
mock 的具体配置放在 modules 的各个功能模块里

1.mocks 文件夹下面 新建拦截的文件，建议一个接口一个文件，例如: index/mocks/list.ts
```
// 正则匹配请求中使用有 /indexList，有则拦截
Mock.mock(/\/indexList/, 'get', 返回值)
```
2.打开 src/main.ts 文件，增加需要 mock 的接口
```
if (import.meta.env.MODE === 'development') {
  import('./modules/index/mocks/index');
  import('./modules/index/mocks/list');
}
```
更多配置参考[使用说明](https://juejin.cn/post/6953199521031520292)

### 多语言配置
语言包跟着每个功能，组件拆分在各个文件夹中

1.添加 locales 文件夹，并新建各个语言包
```
zh_CN.json
en.json
jp.json
```
2.打开 src/i18n/locales，把各个语言包，载入到对应的语言中去
```
zh_CN.ts
en.ts
jp.ts
```
3.配置 i18n
```
import zh_CN from './locales/zh_CN';
import en from './locales/en';
import jp from './locales/jp';
export const i18n = createI18n({
  locale: 'zh_CN',
  fallbackLocale: 'zh_CN',
  allowComposition: true,
  messages: {
    zh_CN,
    en,
    jp
  }
});
```
4.基于zh_CN 自动翻译成多语言，终端里运行。注意 autoTranslate.js 的路径

会遍历目录，找到对应的 zh_CN.json，并在同级的文件夹下，新建 en.json。需要更多语言，请配置 autoTranslate.js
```
node ./autoTranslate.js
```

### 多主题配置
1.新建主题样式 ./src/assets/theme_x.less

2.vite.config.ts 里配置

自行更新条件设置不同的 theme
```
css: {
  preprocessorOptions: {
    less: {
      modifyVars: {
        hack: `true; @import ~"@/assets/css/${theme}.less";`
      },
      javascriptEnabled: true
    }
  }
}
```

#### 图标
iconFont：[使用参考](https://2x.antdv.com/components/icon-cn)