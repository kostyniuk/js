'use strict';

const fetchPropertyFromArr = (arr, property) => {
  return arr.reduce((prev, current) => {
    if (Array.isArray(current[property])) {
      return [...prev, ...current[property]];
    } else {
      return [...prev, current[property]];
    }
  }, []);
};

const calcSumOfPropeperty = (arr, property, initial = 0) =>
  arr.reduce((prev, current) => prev + current[property], initial);

class User {
  constructor(info) {
    this.id = info.id;
    this.username = info.username;
    this.age = info.age;
    this.hobbies = info.hobbies;
  }

  static allHobies(...params) {
    return fetchPropertyFromArr(params, 'hobbies');
  }

  static totalAge(...params) {
    return calcSumOfPropeperty(params, 'age');
  }

  get yearOfBirth() {
    return new Date().getUTCFullYear() - this.age;
  }
}

const kostyniuk = new User({
  id: 1,
  username: 'kostyniuk',
  age: 20,
  hobbies: ['NBA', 'football', 'music'],
});

const dloading = new User({
  id: 2,
  username: 'dloading',
  age: 23,
  hobbies: ['NBA', 'dogs', 'food'],
});

const isco = new User({
  id: 3,
  username: 'isco',
  age: 27,
  hobbies: ['NBA', 'golf'],
});

const allHobbies = User.allHobies(kostyniuk, dloading, isco);
const totalAge = User.totalAge(kostyniuk, dloading, isco);

console.log({ allHobbies, totalAge });

const arr = [kostyniuk, dloading, isco];

const allUsernames = fetchPropertyFromArr(arr, 'username');
const allYearsOfBirth = fetchPropertyFromArr(arr, 'yearOfBirth');
console.log({ allUsernames, allYearsOfBirth });
