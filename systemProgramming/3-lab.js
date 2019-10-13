'use strict';

let expression = process.argv[2];
const regex = /[_a-zA-Z][_a-zA-Z0-9]*/;
const cyrillicPattern = /[\u0400-\u04FF]/;
const regex2 = /\d+[a-zA-Z_]+[a-zA-Z0-9_]+/; //-
const notDetected = [];

const checkRules = (expression) => {
  let copy = expression;
  let match;
  try {
    match = copy.match(regex2)[0];
    notDetected.push(match);
    copy = copy.replace(match, '');
  } catch (err) {
    return copy;
  }
  return checkRules(copy);
};

expression = checkRules(expression);

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

const fix = (symbols, expression) => {
  const singles = symbols.filter(el => el.length < 2);
  const multiples = symbols.filter(el => el.length > 1);
  const i = 0;

  const allentries = (arr, index, expression) => {
    const current = arr[index];
    const indexExp = expression.indexOf(current);
    if (index === arr.length) return;
    if (expression[indexExp] !== expression[indexExp + 1]) {
      if (indexExp !== -1) multiples.push(current);
      index += 1;
      allentries(arr, index, expression);
    } else {
      const start = expression.substring(0, indexExp);
      const end = expression.substring(indexExp + 2);
      expression = start.concat(end);
      allentries(arr, index, expression);
    }
  };
  allentries(singles, i, expression);
  return multiples;
};

const symbolsUsed = fix(getSymbols(expression, symbols), expression);
const reservedUsed = getReserved(expression, reserved);
const numbersUsed = getNumbers(expression);
const identiersUsed = deleteCopies(getIdentiers(expression), reserved);

console.log({ reservedUsed });
console.log({ symbolsUsed });
console.log({ identiersUsed });
console.log({ numbersUsed });
console.log({ notDetected });
