'use strict';

const expression = process.argv[2];
const regex = /[_a-zA-Z][_a-zA-Z0-9]*/;
const cyrillicPattern = /[\u0400-\u04FF]/;
if (expression.match(cyrillicPattern)) {
  console.log('Something went wrong');
  process.exit(1);
}

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
  return Array.from(new Set(symbolsUsed));
};

const getReserved = (str, arrOfReserved) => {
  const reservedUsed = [];
  for (const reserved in arrOfReserved) {
    if (str.includes(arrOfReserved[reserved]))
      reservedUsed.push(arrOfReserved[reserved]);
  }
  return reservedUsed;
};

const identiers = [];
const getIdintiers = expression => {
  const str = expression;
  const current = str.match(regex);
  if (current) {
    identiers.push(current[0]);
    return getIdintiers(str.replace(current, ''));
  }
  return Array.from(new Set(identiers));
};

const getNumbers = (str) => str.match(/\d+/g).map(Number);

const symbolsUsed = getSymbols(expression, symbols);
const reservedUsed = getReserved(expression, reserved);
const numbersUsed = getNumbers(expression);

console.log(reservedUsed);
console.log(symbolsUsed);
console.log(getIdintiers(expression));
console.log(numbersUsed);

for (let i = 0; i < identiers.length; i++) {
  for (let j = 0; j < reservedUsed.length; j++) {
    if (identiers[i] === reservedUsed[j]) {
      identiers.splice(i, 1);
      i--;
    }
  }
}
console.log(identiers);
