'use strict';

// const mur = {
//   'first': {
//     dlm: () => mur.second,
//     cfr: () => mur.second,
//     ltr: () => mur.second,
//   },
//   'second': {
//     logging: 2
//   }
// };

//console.log(mur['1'].dlm());

const myMap = new Map();

myMap.set(1, {
  position: 1,
  dlm: () => myMap.get(2),
  cfr: () => myMap.get(2),
  ltr: () => myMap.get(2),
});

myMap.set(2, {
  position: 2,
  dlm: () => myMap.get(3),
  cfr: () => myMap.get(3),
  ltr: () => myMap.get(3),
});

console.log(myMap.get(1).dlm());
