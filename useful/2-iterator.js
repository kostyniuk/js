'use strict';

// iterator realization, has next() method
// An iterable has the ability to iterate
// over its values through a for..of loop.

const iterator = arr => ({
  next() {
    if (arr.length) return {
      value: arr.shift(),
      done: false
    };
    else {
      return { done: false };
    }
  }
});

// USAGE

const iterable = iterator([1, 2, 3, 4, 5, 6]);

console.log(iterable.next());
console.log(iterable.next());
console.log(iterable.next());
console.log(iterable.next());
console.log(iterable.next());
console.log(iterable.next());
