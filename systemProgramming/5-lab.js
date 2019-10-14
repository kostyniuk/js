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
  for (let i = 0; i < arrOfReserved.length; i++) {
    if (str.includes(arrOfReserved[i])) {
      const token = arrOfReserved[i];
      reservedUsed.push(token);
      str = str.replace(token, '');
      i--;
    }
  }

  // }
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
  errorLogging('Something went wrong.\nTry another expression.');
}
str = checkRules(str);
if (notDetected[0]) {
  console.log(notDetected);
  errorLogging('Something went wrong.\nTry another expression.');
}

const reserved = ['if', 'then', 'else', 'switch', 'case', 'default', 'break',
  'int', 'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void',
  'goto', 'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union',
  'volatile', 'begin', 'end', 'to'];

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

const howManyEnds = lexems => {
  let start = 0;
  let end = 0;
  lexems.forEach(lexem => {
    if (lexem.name === 'T_FOR' || lexem.name === 'T_IF') {
      start++;
    }
    if (lexem.name === 'T_END') {
      end++;
    }
  });
  return start - end;
};

const loggingEndErr = n => {
  if (!n) return;
  if (n > 0) {
    errorLogging('Not enough ENDs');
  } else {
    errorLogging('So many ENDS');
  }
}

loggingEndErr(howManyEnds(lexems));

const isIfCorrect = (lexems) => {
  const table = lexems;
  table.forEach((lexem, index, arr) => {
    if (lexem.name === 'T_THEN') {
      if (arr[index - 1].name !== 'T_RIGHT_PARENTHESIS') {
        errorLogging('ERROR: \')\' missed  expression in IF statement');
      }
      if (arr[index - 2].type !== 'ID') {
        errorLogging('ERROR: Expression is wrong in IF statement');
      }
      if (arr[index + 1].name !== 'T_BEGIN') {
        errorLogging('ERROR: BEGIN is missed in IF statement');
      }
    }
    if (lexem.name === 'T_IF') {
      if (index !== 0) {
        if (arr[index - 1].name !== 'T_SEMICOLON') {
          errorLogging('ERROR: IF statement should be in approapiate position');
        }
      }
      if (arr[index + 1].name !== 'T_LEFT_PARENTHESIS') {
        errorLogging('ERROR: \'(\' missed  expression in IF statement');
      }
      if (arr[index + 2].type !== 'ID') {
        errorLogging('ERROR: Expression is wrong in IF statement');
      }
    }
  }
  );
  return 'Your syntax is correct';
};


const isLoopCorrect = (lexems) => {
  const table = lexems;
  table.forEach((lexem, index, arr) => {
    if (lexem.name === 'T_TO') {
      if (arr[index - 1].type !== 'ID') {
        errorLogging('ERROR: Not ID before to in FOR loop statement');

      }
      if (arr[index - 2].name !== 'T_EQUAL') {
        errorLogging('ERROR: Not Equality symbol found in FOR loop statement');
      }
      if (arr[index - 3].type !== 'ID') {
        errorLogging('ERROR: Not appropriate id as start in FOR loop statement');
      }
      if (arr[index - 4].name !== 'T_FOR') {
        errorLogging('ERROR: No FOR found at needed position found in FOR loop statement');
      }
      if (arr[index + 1].type !== 'ID') {
        errorLogging('ERROR: Not found appropriate high limit in FOR loop statement');
      }
      if (arr[index + 3].name !== 'T_BEGIN') {
        errorLogging('ERROR: Not found BEGIN in FOR loop statement');
      }

    }
    if (lexem.name === 'T_FOR') {
      if (arr[index + 4].name !== 'T_TO') {
        errorLogging('ERROR: No TO keyword found in appropriate position in FOR loop statement');
      }
    }
  }
  );
  return 'Your syntax is correct';
};

const getTreeFormated = tree => {
  for (let i = 0; i < tree.length; i++) {
    console.log(' '.repeat(i), `${tree[i]}`);
  }
};

const buildTree = table => {
  const tree = ['Tree:'];
  for (const lexem of table) {
    if (lexem.name === 'T_FOR') tree.push('for_loop statement');
    if (lexem.name === 'T_IF') tree.push('if_node');
    if (lexem.name === 'T_THEN') tree.push('the_node');
  }
  return tree;
};

//console.log(lexems);
isIfCorrect(lexems);
const tree = buildTree(lexems);
getTreeFormated(tree);