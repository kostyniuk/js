'use strict';
const itb = require("int-to-binary");
const leftSide = 45;
const rightSide = 45;

const calc = left => {

  let flagLeft = 1;
  let current = Math.floor(left / 2);
  const binaries = [flagLeft % 2];
  while (flagLeft) {
    binaries.push(current % 2);
    current = Math.floor(current / 2);
    if (current === 0) {
      flagLeft = 0;
    }
  }
  return binaries.reverse();
};

const calc2 = right => {
  right = parseFloat(`0.${right}`);
  const results = []
  let i = 0;
  while (i < 52) {
    right *= 2;
    right = right.toString();
    results.push(right[0])
    right = parseFloat(`0.${right.split('.')[1]}`);
    i++;
  }
  return results.join('');
};

let left = calc(leftSide);
console.log(left)
let right = calc2(rightSide);
let E = left.length - 1
let m = left.splice(1).join('') + right
console.log(E, m);

let e = 127 + E;
e = itb.unsigned(e, 11)

const standart = `0${e}${m}`;
console.log(standart)