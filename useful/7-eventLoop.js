'use strict';

const fs = require('fs');

console.log('Start');

setTimeout(() => {
  console.log('Timeout 1, 0ms');
}, 0);

process.nextTick(() => {
  console.log('Before everything else');

  setTimeout(() => {
    console.log('Timeout 2, 0ms');
  }, 0);

  setImmediate(() => {
    console.log('Immediate 1');
  });
});

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('Timeout 3, 0ms');
  }, 0);

  setImmediate(() => {
    console.log('Immediate 2');
  });
});

setImmediate(() => {
  console.log('Immediate outer');
});

setTimeout(() => {
  console.log('Timeout 4, 20ms');
}, 20);

console.log('End');
