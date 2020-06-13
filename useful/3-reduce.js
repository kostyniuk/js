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

const fetchPropertyFromArr = (arr, property) => {
  return arr.reduce((prev, current) => {
    return [...prev, current[property]];
  }, []);
};
const totalAge = calcSumOfPropeperty(arr, 'age');
const allUsernames = fetchPropertyFromArr(arr, 'username');
console.log({ totalAge, allUsernames });
