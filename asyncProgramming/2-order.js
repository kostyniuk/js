'use strict';

const wrapAsync = fn => (...args) => setTimeout(
  () => fn(...args), Math.random() * 1000
);

const asyncSum = wrapAsync((arr, callback) => {
  const sum = arr.reduce((acc, value) => acc + value, 0);
  console.log('current array: ', arr);
  callback(null, sum);
}
);

asyncSum([1, 2, 3], () => {
  asyncSum([4, 5, 6], () => {
    asyncSum([7, 8, 9], () => {
      asyncSum([10, 11, 12], () => {
        console.log('All is done');
      });
    });
  });
});
