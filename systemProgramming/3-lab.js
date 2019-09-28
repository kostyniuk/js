'use strict';

const expression = process.argv[2];
const regex = /[_a-zA-Z][_a-zA-Z0-9]*/;
const cyrillicPattern = /[\u0400-\u04FF]/;

if (expression.match(cyrillicPattern)) {
  console.log('Something went wrong.\nTry another expression.');
  process.exit(1);
}

const reserved = ['if', 'then', 'else', 'switch', 'case', 'default', 'break',
  'int', 'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void',
  'goto', 'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
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
const getIdentiers = expression => {
  const str = expression;
  const current = str.match(regex);
  if (current) {
    identiers.push(current[0]);
    return getIdentiers(str.replace(current, ''));
  }
  return Array.from(new Set(identiers));
};

const getNumbers = (str) => {
  try {
    const numbers = str.match(/\d+/g).map(Number);
    return numbers;
  } catch (e)  {
    return null;
  }
};

const deleteCopies = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        arr1.splice(i, 1);
        i--;
      }
    }
  }
  return arr1;
};

const symbolsUsed = getSymbols(expression, symbols);
const reservedUsed = getReserved(expression, reserved);
const numbersUsed = getNumbers(expression);
const identiersUsed = deleteCopies(getIdentiers(expression), reserved);


const fix = (symbols, expression) => {
  const singles = symbols.filter(el => el.length < 2);
  console.log(singles);
  for (let i = 0; i < singles.length; i++) {
    const index = expression.indexOf(singles[i]);
    console.log(index);
    console.log(expression[index]);
    if (expression[index] === expression[index + 1]) {
      console.log('Same ', expression[index]);
      const indexGlobal = symbols.indexOf(singles[i]);
    //   symbols.splice(indexGlobal, 1);
    //   --i;
      //console.log(symbols[i]);
    }
  }
  return symbols;
};

console.log(fix(symbolsUsed, expression));

console.log({ reservedUsed });
console.log({ symbolsUsed });
console.log({ identiersUsed });
console.log({ numbersUsed });
