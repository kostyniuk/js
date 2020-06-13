'use strict';

const arr = [
  {
    id: 1,
    username: 'kostyniuk',
    age: 20,
  },
  {
    id: 2,
    username: 'dloading',
    age: 23,
  },
  {
    id: 3,
    username: 'isco',
    age: 27,
  },
];

const calcSumOfPropeperty = (arr, property, initial = 0) =>
  arr.reduce((prev, current) => prev + current[property], initial);

const totalAge = calcSumOfPropeperty(arr, 'age');
console.log({ totalAge });
