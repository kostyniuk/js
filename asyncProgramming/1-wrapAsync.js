'use strict';

let counter = 0;

const callbackCheck = (quantity, callback) => () => {
  if (++counter === quantity) callback();
};

const wrapAsync = fn => (...args) => setTimeout(
  () => fn(...args), Math.random() * 1000
);

const asyncSum = wrapAsync((arr, callback) => {
  const sum = arr.reduce((acc, value) => acc + value, 0);
  console.log('current array: ', arr);
  callback(null, sum);
}
);

const callback = callbackCheck(4, () => console.log('All is done'));

asyncSum([1, 2, 3], callback);
asyncSum([4, 5, 6], callback);
asyncSum([7, 8, 9], callback);
asyncSum([10, 11, 12], callback);
