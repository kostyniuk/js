'use strict';
const fs = require('fs');

const data = fs.readFileSync('./4-tokens.json', 'utf8');
const tokens = JSON.parse(data).tokens;
const tokenss = JSON.parse(data).tokens;

//console.log(tokenss.symbol)

let symbolsAll = {};
const tokesSymb = {};

for (const operators in tokens.symbol) {
  Object.assign(symbolsAll, tokens.symbol[operators]);
  Object.assign(tokesSymb, tokens.symbol[operators]);
}
symbolsAll = Object.keys(symbolsAll);
const symbolsTokenNames = Object.values(tokesSymb);

let keywordsAll = {};
const tokenKeywords = {};

for (const operators in tokens.keyword) {
  Object.assign(keywordsAll, tokens.keyword[operators]);
  Object.assign(tokenKeywords, tokens.keyword[operators]);
}

keywordsAll = Object.keys(tokenKeywords);
const keywordsTokenNames = Object.values(tokenKeywords);

/*b=2*a[n]; b=d;
expression, assignment-operator, expression, unary-operator, expression
 expression assignment_operator, expression;
<expression> ::= <assignment-expression> | <expression> , <assignment-expression>
<assignment-expression> ::= <conditional-expression> | <unary-expression> <assignment-operator> <assignment-expression>
 <assignment-operator> ::= =
| *=
| /=
| %=
| +=
| -=
| <<=
| >>=
| &=
| ^=
| |=

<unary-operator> ::= &
| *
| +
| -
| ~
| !
*/

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
  //return Array.from(new Set(symbolsUsed));
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
      console.log(current);
      expression = start.concat(end);
      console.log(expression);
      allentries(arr, index, expression);
    }
  };
  allentries(singles, i, expression);
  return multiples;
};

const eliminateFloatsFromInts = (arrFl, arrInt) => {

  const flatArrFl = arrFl.flat();
  const flatArrInt = arrInt.flat();

  if (!flatArrFl) return flatArrInt;
  const parts = flatArrFl.map(element => element.split('.'));
  parts.forEach(arr => arr.forEach(el => {
    const index = flatArrInt.indexOf(el);
    flatArrInt.splice(index, 1);
  })
  );
  return flatArrInt;
};

const getReserved = (str, arrOfReserved) => {
  const reservedUsed = [];
  for (const reserved in arrOfReserved) {
    if (str.includes(arrOfReserved[reserved]))
      reservedUsed.push(arrOfReserved[reserved]);
  }
  return reservedUsed;
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

const regex2 = /\d+[a-zA-Z_]+[a-zA-Z0-9_]*/; //-
const cyrillicPattern = /[\u0400-\u04FF]/;
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



let str = process.argv[2];
console.log(str);
if (str.match(cyrillicPattern)) {
  console.log('Something went wrong.\nTry another expression.');
  process.exit(1);
}
str = checkRules(str);
if (notDetected[0]) {
  console.log(notDetected);
  console.log('Something went wrong.\nTry another expression.');
  process.exit(1);
}

const reserved = ['if', 'then', 'else', 'switch', 'case', 'default', 'break',
  'int', 'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void',
  'goto', 'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile'];

let expressions = str.split(';').slice(0, -1);
expressions = expressions.map(el => el.trim());
console.log({ expressions });

let ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));

let floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();
floats = floats.filter((obj) => obj);

let integers = expressions.map(el => el.match(/\d+/g)).flat();
integers = integers.filter((obj) => obj);
integers = eliminateFloatsFromInts(floats, integers);

const keyWords = getReserved(str, reserved);
ids = deleteCopies(ids.flat(), keyWords);


//console.log(getSymbols(str, symbolsAll));
const symbolsUsed = fix(getSymbols(str, symbolsAll), str);

const getIndexes = (str, hash) => {
  const result = [];

  const exec = (str, hash) => {
    for (const tokens in hash) {
      const arrLength = hash[tokens].length;
      for (let i = 0; i < arrLength; i++) {
        let name;
        let type;
        const token = hash[tokens][i];
        const length = token.length;
        const index = str.indexOf(token);
        let indexToken = symbolsAll.indexOf(token);
        if (indexToken !== -1) {
          name = symbolsTokenNames[indexToken];
          for (const op in tokenss.symbol) {
            if (tokenss.symbol[op][token]) type = op;
          }

        } else {
          indexToken = keywordsAll.indexOf(token);
          name = keywordsTokenNames[indexToken];
          for (const op in tokenss.keyword) {
            if (tokenss.keyword[op][token]) type = op;
          }
        }
        if (!name) {
          name = 'ID';
          type = 'ID';
        }
        result.push({ token, index, length, type, name });
        str = str.replace(token, '.'.repeat(length));
      }
    }
  };
  exec(str, hash);
  return result;
};

const isOpenBracketBefore = (lexemTable, index) => {
  let lBr = 0;
  let rBr = 0;
  let lPr = 0;
  let rPr = 0;
  for (let i = 0; i < index; i++) {
    //console.log(lexemTable[i].name);
    if (lexemTable[i].name === 'T_LEFT_BRACKET') lBr++;
    if (lexemTable[i].name === 'T_RIGHT_BRACKET') rBr++;
    if (lexemTable[i].name === 'T_LEFT_PARENTHESIS') lPr++;
    if (lexemTable[i].name === 'T_RIGHT_PARENTHESIS') rPr++;
  }
  //console.log(lBr, rBr, lPr, rPr);
  const leftBrIsOpen = (lBr - rBr > 0);
  const leftPrIsOpen = (lPr - rPr > 0);
  return { leftBrIsOpen, leftPrIsOpen };
};

const myTokens = {
  keyWords,
  ids,
  floats,
  integers,
  symbolsUsed
};

const lexems = getIndexes(str, myTokens);

lexems.sort((a, b) => {
  const keyA = a.index;
  const keyB = b.index;
  // Compare the 2 dates
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
});
//console.log(lexems);

const checking = (lexTable, index) => {
  const lexem = lexTable[index];
  if (index === 0 || lexTable[index - 1].name === 'T_SEMICOLON') {
    if (lexTable.length === index) return;
    console.log('new expression');

  }

  if (lexem.type === 'ID') {
    console.log('ID', lexem);
    if (lexTable[index + 1].type === 'assignment_operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'binary-operator' ||
      lexTable[index + 1].name === 'unary-operator' ||
      lexTable[index + 1].type === 'unary-operator') {
      index++;
      checking(lexTable, index);
    }
    if (lexTable[index + 1].type === 'parenthesis-operator') {
      const isBrOpened = isOpenBracketBefore(lexTable, index);
      if (isBrOpened.leftBrIsOpen && isBrOpened.leftPrIsOpen) {
        if (lexTable[index + 1].name === 'T_RIGHT_BRACKET' ||
        lexTable[index + 1].name === 'T_RIGHT_PARANTHESIS') {
          index++;
          checking(lexTable, index);
        }
      }
      if (isBrOpened.leftBrIsOpen) {
        if (lexTable[index + 1].name === 'T_RIGHT_BRACKET') {
          index++;
          checking(lexTable, index);
        }
      }
      if (isBrOpened.leftPrIsOpen) {
        if (lexTable[index + 1].name === 'T_RIGHT_PARANTHESIS') {
          index++;
          checking(lexTable, index);
        }
      }
      if (lexTable[index + 1].name === 'T_SEMICOLON') {
        index++;
        checking(lexTable, index);
      }
      if (lexTable[index + 1].name === 'T_LEFT_PARENTHESIS' ||
      lexTable[index + 1].name === 'T_LEFT_BRACKET') {
        index++;
        console.log('here');
        checking(lexTable, index);
      }
      console.log(lexTable[index], index)
      console.log('error')
      process.exit(0);
    }
  }
  if (lexem.type === 'assignment_operator') {
    console.log('assignment_operator', lexem);

    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    }
    else {
      console.log('error', lexTable[index + 1]);
      process.exit(0);
    }
  }
  if (lexem.type === 'unary-operator') {
    console.log('unary-operator', lexem);
    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    }
    else {
      console.log('error', lexTable[index + 1]);
      process.exit(0);
    }
  }
  if (lexem.type === 'parenthesis-operator') {
    console.log('parenthesis-operator', lexem);
    if (lexem.name === 'T_LEFT_BRACKET' || lexem.name === 'T_LEFT_PARENTHESIS')
      if (lexTable[index + 1].type === 'ID') {
        index++;
        checking(lexTable, index);
      }
      else {
        console.log('error', lexTable[index + 1]);
        process.exit(0);
      }
  }
  if (lexem.type === 'condition_operator') {
    console.log('condition_operator', lexem);
    index++;
    checking(lexTable, index);
  }
  if (lexem.type === 'selection-statement') {
    console.log('selection-statement', lexem);
    index++;
    checking(lexTable, index);
  }
  if (lexem.type === 'iteration-statement') {
    console.log('iteration-statement', lexem);
    index++;
    checking(lexTable, index);
  }
  return 'konec';
};

console.log(checking(lexems, 0));



//isOpenBracketBefore(lexems, lexems.length);
