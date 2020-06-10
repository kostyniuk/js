// eslint-disable-next-line quotes
"use strict";

// ALT + SHIFT + F

setTimeout(() => {
  console.log('macrotask 1');
}, 500);

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('microtask 1 started');
    setTimeout(() => {
      console.log('microtask 1 end');
    }, 400);
  }, 300);
});

Promise.resolve().then(() => {
  setTimeout(() => {
    console.log('microtask 2');
  }, 400);
});

//   .then((res) => console.log('microtask 3'))
//   .then((res) => console.log('microtask 4'))
//   .catch((e) => {
//     console.error(e);
//   });
