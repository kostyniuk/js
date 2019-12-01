'use strict';

const helper = require('./doublepoint');



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

const { makeIEE754 } = helper;
const integer = 2;
const float = 372348;
const binIEE754 = makeIEE754(integer, float);
console.log({ binIEE754 });
const hexIEE754 = convertBinToHex(binIEE754);
console.log({ hexIEE754 });
const decIEE754 = converter.hexToDec(hexIEE754);
console.log({ decIEE754 });

module.exports = () => ;