'use strict';
const itb = require('int-to-binary');

module.exports = {
  makeIEE754: (integer, float) => {

    const calc = left => {

      console.log({left})
      let flagLeft = 1;
      let current = Math.floor(left / 2);
      const binaries = [left % 2];
      console.log(binaries)
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
      const results = [];
      let i = 0;
      while (i < 64) {
        right *= 2;
        right = right.toString();
        results.push(right[0]);
        right = parseFloat(`0.${right.split('.')[1]}`);
        i++;
      }
      return results.join('');
    };

    const left = calc(integer);
    console.log({left})
    const right = calc2(float);
    console.log({right})
    const E = left.length - 1;
    const m = left.splice(1).join('') + right;

    console.log({m})

    let e = 127 + E ;//1023
    e = itb.unsigned(e, 8);//11

    console.log({e})

    let standart = `0${e}${m}`;
    standart = standart.split('');
    standart = standart.splice(0, 32);//64
    standart = standart.join('')
    console.log({shouldBe: '01000000000100110011001100110011', standart })

    return standart;
  }
};

// need to use float instead