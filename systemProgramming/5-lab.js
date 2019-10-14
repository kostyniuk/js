'use strict';
const fs = require('fs');
const getAllSymbols = require('./4-symbols');

const data = fs.readFileSync('./5-tokens.json', 'utf8');
const tokens = JSON.parse(data).tokens;
const tokenss = JSON.parse(data).tokens;

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

const regex2 = /\d+[a-zA-Z_]+[a-zA-Z0-9_]*/;
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

const errorLogging = (issue) => {
  console.log(issue);
  process.exit(1);
  return;
};

let str = process.argv[2];
str = str.toLowerCase();
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
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile', 'do', 'begin', 'end', 'to'];

let expressions = str.split(';');
if (expressions.length > 1) expressions = expressions.slice(0, -1);
expressions = expressions.map(el => el.trim());

let ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));
console.log(expressions);

let floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();
floats = floats.filter((obj) => obj);

let integers = expressions.map(el => el.match(/\d+/g)).flat();
integers = integers.filter((obj) => obj);
integers = eliminateFloatsFromInts(floats, integers);

const keyWords = getReserved(str, reserved);
ids = deleteCopies(ids.flat(), keyWords);

const singleSymb = symbolsAll.filter(el => el.length === 1);
const multipleSymb = symbolsAll.filter(el => el.length === 2);

//const symbolsUsed = fix(getSymbols(str, symbolsAll), str);
const symbolsUsed = getAllSymbols(str, singleSymb, multipleSymb);
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
          for (const arr in hash) {
            const array = hash[arr];
            if (array.includes(token)) {
              name = arr;
            }
          }
          name = name || 'ID';
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
    if (lexemTable[i].name === 'T_LEFT_BRACKET') lBr++;
    if (lexemTable[i].name === 'T_RIGHT_BRACKET') rBr++;
    if (lexemTable[i].name === 'T_LEFT_PARENTHESIS') lPr++;
    if (lexemTable[i].name === 'T_RIGHT_PARENTHESIS') rPr++;
  }
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
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
});




const isLoopCorrect = (lexems) => {
  const table = lexems;
  table.forEach((lexem, index, arr) => {
    if (lexem.name === 'T_TO') {
      if (arr[index - 1].type !== 'ID') {
        console.log('ERROR: Not ID before to in FOR loop statement');
        process.exit(0);
      }
      if (arr[index - 2].name !== 'T_EQUAL') {
        console.log('ERROR: Not Equality symbol found in FOR loop statement');
        process.exit(0);
      }
      if (arr[index - 3].type !== 'ID') {
        console.log('ERROR: Not appropriate id as start in FOR loop statement');
        process.exit(0);
      }
      if (arr[index - 4].name !== 'T_FOR') {
        console.log(arr[index - 3]);
        console.log('ERROR: No FOR found at needed position found in FOR loop statement');
        process.exit(0);
      }
      if (arr[index + 1].type !== 'ID') {
        console.log('ERROR: Not found appropriate high limit in FOR loop statement');
        process.exit(0);
      }
      if (arr[index + 1].type !== 'ID') {
        console.log('ERROR: Not found appropriate high limit in FOR loop statement');
        process.exit(0);
      }
      //for(let i = 0; i < index; i++) {

    }
  }
  );
};

console.log(isLoopCorrect(lexems));
process.exit(0);

const checking = (lexTable, index) => {
  if (index === lexTable.length) process.exit(0);
  const lexem = lexTable[index];
  if (index === 0 || lexTable[index - 1].name === 'T_SEMICOLON') {
    //if (lexTable.length === index) return;
    if (lexem.type !== 'ID') {
      if (lexem.type !== 'iteration-statement') {
        if (lexem.type !== 'condition_operator') {
          console.log('Expression cant start with the lexem.');
          console.log(lexem);
          process.exit(0);
        }
      }
    }
  }

  if (lexem.type === 'ID') {
    console.log('ID', lexem);
    if (lexTable[index + 1].type === 'assignment_operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'binary-operator') {
      index++;
      checking(lexTable, index);
    }

    if (lexTable[index + 1].name === 'T_TO' ||
    lexTable[index + 1].name === 'T_BEGIN') {
      index++;
      checking(lexTable, index);
    }
    console.log('should be :=', lexTable[index]);
    if (lexTable[index + 1].type === 'ID') {
      console.log('id right after id error', lexTable[index], lexTable[index + 1]);
      process.exit(0);
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
        checking(lexTable, index);
      }
      console.log(lexTable[index], index);
      console.log('ERROR : Parenthesis error');
      process.exit(0);
    }
  }
  if (lexem.type === 'assignment_operator') {
    console.log('assignment_operator', lexem);

    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log('ERROR : Not an ID after assignment operator',
        lexTable[index + 1]);
      process.exit(0);
    }
  }
  if (lexem.type === 'unary-operator') {
    console.log('unary-operator', lexem);
    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log('ERROR: Not an ID after unary operator', lexTable[index + 1]);
      process.exit(0);
    }
  }
  if (lexem.type === 'parenthesis-operator') {
    console.log('parenthesis-operator', lexem);
    if (lexem.name === 'T_LEFT_BRACKET' ||
    lexem.name === 'T_LEFT_PARENTHESIS') {
      if (lexTable[index - 1].name === 'integers' ||
      lexTable[index - 1].name === 'floats') {
        console.log('error: number and parenthesis', lexTable[index - 1]);
        process.exit(0);
      }
      if (lexTable[index + 1].type === 'ID') {
        index++;
        checking(lexTable, index);
      } else {
        console.log('error dasa', lexTable[index + 1]);
        process.exit(0);
      }
    }
    if (lexem.name === 'T_RIGHT_BRACKET' ||
    lexem.name === 'T_RIGHT_PARENTHESIS') {
      if (lexTable[index + 1].type === 'ID') {
        console.log('errorfsdfsd ', lexTable[index + 1]);
        process.exit(0);
      }
    } else {
      index++;
      checking(lexTable, index);
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
