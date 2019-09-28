'use strict';

const expression = process.argv[2];

const reserved = ['if', 'else', 'switch', 'case', 'default', 'break', 'int',
  'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void', 'goto',
  'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile'];

const symbols = [':', '+', '-', '*', '/', '%', '++', '--', '==', '!=', '>',
  '<',  '>=', '<=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>',
  '=', '+=', '-=', '*=', '/=', '<<=', '>>=', '&=', '^=', '|=', '(',
  ')', '[', ']', '?', '<>', '{', '}', ':', ';', '.',  ];

const getSymbols = (str, arrOfSymbols) => {
  const symbolsUsed = [];
  const arr = str.split(' ');
  for (let i = 0; i < arrOfSymbols.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      const temp = arr[j].split(arrOfSymbols[i]);
      if (temp.length > 1) symbolsUsed.push(arrOfSymbols[i]);
    }
  }
  return symbolsUsed;
};

const getReserved = (str, arrOfReserved) => {
  const reservedUsed = [];
  for (const reserved in arrOfReserved) {
    if (str.includes(arrOfReserved[reserved]))
      reservedUsed.push(arrOfReserved[reserved]);
  }
  return reservedUsed;
};

const getNumbers = (str) => str.match(/\d+/g).map(Number);

const symbolsUsed = new Set(getSymbols(expression, symbols));
const reservedUsed = getReserved(expression, reserved);
const numbersUsed = getNumbers(expression);

console.log(reservedUsed);
console.log(symbolsUsed);
console.log(numbersUsed);

const cyrillicPattern = /^[\u0400-\u04FF]+$/;

const identifiers = /^[_a-zA-Z][_a-zA-Z0-9]+/g/;
console.log(expression.match(identifiers));
const variables = [];


