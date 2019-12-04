'use strict';
const itb = require('int-to-binary');
const converter = require('hex2dec');

const BintoHex = {
  '0000': '0',
  '0001': '1',
  '0010': '2',
  '0011': '3',
  '0100': '4',
  '0101': '5',
  '0110': '6',
  '0111': '7',
  '1000': '8',
  '1001': '9',
  '1010': 'A',
  '1011': 'B',
  '1100': 'C',
  '1101': 'D',
  '1110': 'E',
  '1111': 'F',
};

module.exports = {
  makeIEE754: (integer, float) => {
    let minus = false;
    if (integer[0] === '-') {
      minus = true;
      integer = integer.replace('-', '').trim();
    }
    const calc = left => {
      
      let flagLeft = 1;
      let current = Math.floor(left / 2);
      const binaries = [left % 2];
      while (flagLeft) {
        if (current === 0) {
          flagLeft = 0;
          break;
        }
        binaries.push(current % 2);
        current = Math.floor(current / 2);
        // if (current === 0) {
        //   flagLeft = 0;
        // }
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
    const right = calc2(float);
    const E = left.length - 1;
    const m = left.splice(1).join('') + right;

    let e = 127 + E ;//1023
    e = itb.unsigned(e, 8);//11

    const sign = minus ? 1 : 0 
    let standart = `${sign}${e}${m}`;
    standart = standart.split('');
    standart = standart.splice(0, 32);//64
    standart = standart.join('');
    return standart;
  },

  binToHex: bin => {
    let bits4 = [];
    const length = bin.length;
    for (let i = 0; i < length; i++) {
      if (i % 4 === 3) {
        bits4[i] = [bin[i - 3], bin[i - 2], bin[i - 1], bin[i]];
      }
    }
    bits4 = bits4.filter(arr => arr.length).map(arr => arr.join('')).map(str => BintoHex[str]).join('');
    return bits4;
  },

  hexToDec: hex => converter.hexToDec(hex)
};
