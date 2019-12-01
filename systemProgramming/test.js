'use strict';

var converter = require('hex2dec');

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

const convertBinToHex = bin => {
  let bits4 = [];
  const length = bin.length;
  for (let i = 0; i < length; i++) {
    if (i % 4 === 3) {
      bits4[i] = [bin[i - 3], bin[i - 2], bin[i - 1], bin[i]];
    }
  }
  bits4 = bits4.filter(arr => arr.length).map(arr => arr.join('')).map(str => BintoHex[str]).join('');
  return bits4;
};


const helper = require('./doublepoint');
const { makeIEE754 } = helper;
console.log('45')
const integer = 2;
const float = 372348;
const binIEE754 = makeIEE754(integer, float);
console.log({ res: binIEE754, lengthL: binIEE754.length });
const hexIEE754 = convertBinToHex(binIEE754);
console.log(hexIEE754);
const decIEE754 = converter.hexToDec(hexIEE754);
console.log(decIEE754);