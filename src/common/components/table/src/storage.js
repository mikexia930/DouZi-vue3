function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
}

function getStorage(key) {
  let backData = '';

  try {
    const storageData = localStorage.getItem(key);
    if (storageData) {
      backData = JSON.parse(storageData);
    }
  } catch (e) {
    console.log(e);
  }

  return backData;
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
}

export { setStorage, getStorage, removeStorage };
