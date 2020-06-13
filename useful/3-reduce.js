'use strict';

class User {
  constructor(info) {
    this.id = info.id;
    this.username = info.username;
    this.age = info.age;
    this.hobbies = info.hobbies;
  }

  get yearOfBirth() {
    return new Date().getUTCFullYear() - this.age;
  }
}

const arr = [
  new User({
    id: 1,
    username: 'kostyniuk',
    age: 20,
    hobbies: ['NBA', 'football', 'music'],
  }),
  new User({
    id: 2,
    username: 'dloading',
    age: 23,
    hobbies: ['NBA', 'dogs', 'food'],
  }),
  new User({
    id: 3,
    username: 'isco',
    age: 27,
    hobbies: ['NBA', 'golf'],
  }),
];

const calcSumOfPropeperty = (arr, property, initial = 0) =>
  arr.reduce((prev, current) => prev + current[property], initial);

const fetchPropertyFromArr = (arr, property) => {
  return arr.reduce((prev, current) => {
    if (Array.isArray(current[property])) {
      return [...prev, ...current[property]];
    } else {
      return [...prev, current[property]];
    }
  }, []);
};
const totalAge = calcSumOfPropeperty(arr, 'age');
const allUsernames = fetchPropertyFromArr(arr, 'username');
const allHobbies = fetchPropertyFromArr(arr, 'hobbies');
const allYearsOfBirth = fetchPropertyFromArr(arr, 'yearOfBirth');
console.log({ totalAge, allUsernames, allHobbies, allYearsOfBirth });
