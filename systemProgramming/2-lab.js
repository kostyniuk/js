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

myMap.set(3, {
  position: 3,
  dlm: () => myMap.get(7), // unusual
  cfr: () => myMap.get(4),
  ltr: () => myMap.get(4),
});

myMap.set(4, {
  position: 4,
  dlm: () => myMap.get(5),
  cfr: () => myMap.get(5),
  ltr: () => myMap.get(8), // unusual
});

myMap.set(5, {
  position: 5,
  dlm: () => myMap.get(6),
  cfr: () => myMap.get(5), // unusual
  ltr: () => myMap.get(6),
});

myMap.set(6, {
  position: 6,
  dlm: () => myMap.get(7),
  cfr: () => myMap.get(7),
  ltr: () => myMap.get(7),
});

myMap.set(7, {
  position: 7,
  dlm: () => myMap.get(8),
  cfr: () => myMap.get(8),
  ltr: () => myMap.get(8),
});

myMap.set(8, {
  position: 8,
  dlm: () => myMap.get(8),
  cfr: () => myMap.get(8),
  ltr: () => myMap.get(8),
});
//console.log(myMap.get(1).dlm().cfr().dlm());

const simulation = (map, args) => {
  const signals = args;
  console.log({ map, signals });
  console.log(typeof map);
};

//console.log(parse(1, 2, 3, 4, 5));

//console.log(simulation(myMap.get(1), ['dlm', 'cfr', 'dlm', 'ltr']));

const execution = (map, start, ...signals) => {
  const primary = map.get(start);
  let result = primary[signals[0]]();
  console.log(result);
  for (let i = 1; i < signals.length; i++) {
    result = result[signals[i]]();
    console.log(result, i);
  }
  return result;
};

console.log(execution(myMap, 1, 'dlm', 'cfr', 'dlm', 'ltr'));
