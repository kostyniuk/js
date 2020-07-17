'use strict';

let timeId = null;

//need to use promises to assure that the functions returns resultson time only after callback gets responce

const debounce = (timeout, param) =>
  new Promise((resolve) => {
    let responce = null;
    clearTimeout(timeId);
    timeId = setTimeout(async () => {
      // await api(param)  API CALL;
      const json = { mock: `data_${param}` };
      console.log({ json });
      responce = json;
      resolve(responce);
    }, timeout);
  });

const debounce500 = debounce.bind(null, 500);

setTimeout(async () => {
  const responce = await debounce500('first');
  console.log({ responce });
}, 200);

setTimeout(async () => {
  const responce = await debounce500('second');
  console.log({ responce });
}, 200);
