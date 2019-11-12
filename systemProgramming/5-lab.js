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
    if (str.includes(`${arrOfReserved[i]} `) ||
    str.includes(`${arrOfReserved[i]};`)) {
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

const regex2 = /\W+\d+[a-zA-Z_]+[a-zA-Z0-9_]*/;
const cyrillicPattern = /[\u0400-\u04FF]/;
const notDetected = [];

const checkRules = (expression) => {
  let copy = expression;
  let match;
  try {
    match = copy.match(regex2)[0];
    notDetected.push(match.substr(1));
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
str = str.toLowerCase() + ' ';
if (str.match(cyrillicPattern)) {
  errorLogging('Something went wrong.\nTry another expression.');
}

console.log(str);
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
ids = ids.filter((obj) => obj);

let floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();
floats = floats.filter((obj) => obj);

let integers = expressions.map(el => el.match(/\W\d+/g)).flat();

integers = integers.filter(Boolean).map(el => el.match(/\d+/g));
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
  let forC = 0;
  let ifC = 0;
  lexems.forEach(lexem => {
    if (lexem.name === 'T_BEGIN') {
      start++;
    }
    if (lexem.name === 'T_END') {
      end++;
    }
    if (lexem.name === 'T_FOR') {
      forC++;
    }
    if (lexem.name === 'T_IF') {
      ifC++;
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
};

loggingEndErr(howManyEnds(lexems));

const isEndIsSemicoln = table => {
  table.forEach((lexem, i, arr) => {
    if (lexem.token === ';') {
      if (arr[i - 1].type === 'binary-operator' ||
      arr[i - 1].type === 'parenthesis-operator' ||
      arr[i - 1].type === 'selection-statement' ||
      arr[i - 1].name === 'T_END' ||
      arr[i - 1].type === 'ID') {
        if (arr[i - 1].token !== ';') {
          console.log('');
        } else {
          console.log(`You have an error at ${arr[i].index} index`);
          process.exit(1);
        }
      }
    }
    if (lexem.token === 'end' && lexem.index !== 0) {
      if (arr[i - 1].name !== 'T_SEMICOLON') {
        if (arr[i - 1].name !== 'T_BEGIN') {
          console.log('ERROR: \';\' should be used before \'end\'');
          process.exit(1);
        }
      }
    }
  });
};

const isOpenBracketBefore = (lexemTable, index) => {
  let lBr = 0;
  let rBr = 0;
  let lPr = 0;
  let rPr = 0;
  //console.log({ lexemTable })
  for (let i = 0; i < index; i++) {
    //console.log(lexemTable[i]);
    if (lexemTable[i].token === '[') lBr++;
    if (lexemTable[i].token === ']') rBr++;
    if (lexemTable[i].token === '(') lPr++;
    if (lexemTable[i].token === ')') rPr++;
  }
  const leftBrIsOpen = (lBr - rBr > 0);
  const leftPrIsOpen = (lPr - rPr > 0);
  return { 'T_RIGHT_BRACKET': leftBrIsOpen, 'T_RIGHT_PARENTHESIS': leftPrIsOpen, all: [lBr - rBr, lPr - rPr] };
};

const bracket = isOpenBracketBefore(lexems, lexems.length).all;
bracket.forEach((el) => {
  if (el !== 0) {
    console.log('ERROR: Quantity of brackets doesnt match');
    process.exit(1);
  }
});

const isLoopRangesRight = table => {
  table.forEach((lexem, i, arr) => {
    if (lexem.token === 'to') {
      if (parseInt(arr[i - 1].token) > parseInt(arr[i + 1].token)) {
        console.log('ERROR: Unresolved ranges of loop');
        process.exit(1);
      }
    }
  });
};

const isBeginBefore = (table, index) => {
  table = table.slice(0, index);
  let ends = 0;
  let begins = 0;
  table.forEach((lexem, i, arr) => {
    if (lexem.token === 'end') ends++;
    if (lexem.token === 'begin') begins++;
  });
  return begins - ends;
};

const isEndCouldBeUsed = table => {
  table.forEach((lexem, i, arr) => {
    if (lexem.token === 'end') {
      if (!isBeginBefore(table, i)) {
        console.log('ERROR: End should be used with begin');
        process.exit(1);
      }
    }
  });
};

isLoopRangesRight(lexems);
isEndCouldBeUsed(lexems);
isEndIsSemicoln(lexems);

const isLoopCorrect = (lexems) => {
  const table = lexems;
  if (table[table.length - 1].name !== 'T_SEMICOLON') errorLogging('expression must end with ; ');
  table.forEach((lexem, index, arr) => {

    if (lexem.name === 'T_FOR') {
      if (arr[index + 1].name !== 'ids') {
        errorLogging('ERROR: Not appropriate id as start in FOR loop statement');
      }
      if (arr[index + 2].name !== 'T_EQUAL') {
        errorLogging('ERROR: Not Equality symbol found in FOR loop statement');
      }
      if (arr[index + 3].name !== 'integers') {
        errorLogging('ERROR: You can assign only integers to id in FOR loop statement');
      }
      if (arr[index + 4].name !== 'T_TO') {
        errorLogging(`ERROR: No TO keyword found in appropriate position in FOR loop statement at ${arr[index + 4].index} index.`);
      }
    }
    if (lexem.name === 'T_TO') {
      try {
        if (arr[index + 1].type !== 'ID') {
          errorLogging('ERROR: No high range found in FOR loop statement');
        }
        if (arr[index - 4].name !== 'T_FOR') {
          errorLogging('ERROR: No FOR found at needed position found in FOR loop statement');
        }
      } catch (e) { errorLogging('ERROR: For is missed'); }
      if (arr[index + 2].name !== 'T_DO') {
        errorLogging('ERROR: No Do found in FOR loop statement');
      }
      // if (arr[index + 3].name !== 'T_BEGIN') {
      //   errorLogging('ERROR: Not found BEGIN in FOR loop statement');
      // }
    }
    if (lexem.name === 'T_BEGIN') {
      if (arr[index + 1].type !== 'ID') {
        if (arr[index + 1].type !== 'condition_operator') {
          if (arr[index + 1].type !== 'iteration-statement') {
            console.log(arr[index + 1]);
            errorLogging('ERROR: You can use the lexem after BEGIN');
          }
        }
      }
      if (arr[index - 1].name !== 'T_DO') {
        console.log(arr[index - 1]);
        errorLogging('ERROR: You cant use the lexem before BEGIN');
      }
    }
    if (lexem.name === 'T_END') {
      if (arr[index + 1].name !== 'T_SEMICOLON') {
        errorLogging('ERROR: END should be followed with ; ');
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

const checking = (lexTable, index) => {
  if (index === lexTable.length) process.exit(0);
  const lexem = lexTable[index];
  if (index === 0 || lexTable[index - 1].name === 'T_SEMICOLON') {
    if (lexem.name !== 'ids') {
      if (lexem.name !== 'T_FOR') {
        if (lexem.name !== 'T_END') {
          console.log(`ERROR: Expression cant start with the lexem \nlexem '${lexTable[index].token}' at ${lexTable[index].index} index`);
          process.exit(0);
        }
      }
    }
  }
  if (lexem.type === 'ID') {
    if (lexTable[index + 1].type === 'assignment_operator' ||
      lexTable[index + 1].token === ':=' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'binary-operator' ||
      lexTable[index + 1].name === 'unary-operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].name === 'T_TO' ||
      lexTable[index + 1].name === 'T_DO') {
      index++;
      checking(lexTable, index);
    }
    if (lexTable[index + 1].type === 'ID') {
      console.log(`Error: id right after id, \nlexem '${lexTable[index + 1].token}' at ${lexTable[index + 1].index} index`);
      process.exit(0);
    }
    if (lexTable[index + 1].type === 'parenthesis-operator') {
      //const isBrOpened = isOpenBracketBefore(lexTable, index);
      if (lexTable[index + 1].name === 'T_RIGHT_BRACKET' ||
        lexTable[index + 1].name === 'T_RIGHT_PARENTHESIS') {
        index++;
        checking(lexTable, index);
      }

      if (lexTable[index + 1].name === 'T_RIGHT_BRACKET') {
        index++;
        checking(lexTable, index);
      }

      if (lexTable[index + 1].name === 'T_RIGHT_PARENTHESIS') {
        index++;
        checking(lexTable, index);
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
      console.log(`ERROR: Lexem ${lexTable[index + 1].token} can't be used at ${lexTable[index + 1].index} index`);
      process.exit(0);
    }
  }
  if (lexem.type === 'assignment_operator') {
    //console.log('assignment_operator', lexem);
    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log(`ERROR: You can assing only ID variables, \nlexem ${lexTable[index + 1].token} at ${lexTable[index + 1].index}`);
      process.exit(0);
    }
  }
  if (lexem.type === 'unary-operator') {
    //console.log('unary-operator', lexem);
    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log(`ERROR: Unary operators can be used only after IDs, \nlexem ${lexTable[index + 1].token} at ${lexTable[index + 1].index}`);
      process.exit(0);
    }
  }
  if (lexem.type === 'parenthesis-operator') {
    //console.log('parenthesis-operator', lexem);
    if (lexem.name === 'T_LEFT_BRACKET' ||
    lexem.name === 'T_LEFT_PARENTHESIS') {
      if (lexTable[index + 1].name === 'T_LEFT_BRACKET' ||
      lexTable[index + 1].name === 'T_RIGHT_BRACKET') {
        console.log(`ERROR: So many '${lexem.token} at ${lexem.index} index'`);
        process.exit(1);
      }
      if (lexTable[index - 1].name !== 'ids') {
        if (lexTable[index - 1].name !== 'T_RIGHT_BRACKET')
          console.log(`ERROR: You should use [] operators only after variables, \nlexem '${lexTable[index - 1].token}' at index ${lexTable[index - 1].index}`);
        process.exit(0);
      }
      if (lexTable[index + 1].name === 'ids' || lexTable[index + 1].name === 'integers') {
        index++;
        checking(lexTable, index);

      } else {
        console.log(`ERROR: Something wrong with your brackets, \nlexem '${lexTable[index + 1].token}' at index ${lexTable[index + 1].index}`);
        process.exit(0);
      }
    }

    if (lexem.name === 'T_RIGHT_BRACKET' ||
    lexem.name === 'T_RIGHT_PARENTHESIS') {
      const current = lexem.name;
      if (!isOpenBracketBefore(lexTable, index)[current]) {
        console.log(`ERROR: So many '${lexem.token} at ${lexem.index} index'`);
        process.exit(1);
      }
      if (lexTable[index + 1].type === 'ID') {
        console.log(`ERROR: You can't use ID right after brackets, \nlexem ${lexTable[index + 1].token} at index ${lexTable[index + 1].index}`);
        process.exit(0);
      }
    } else {
      index++;
      checking(lexTable, index);
    }
  }
  if (lexem.type === 'condition_operator') {
    //console.log('condition_operator', lexem);
    index++;
    checking(lexTable, index);
  }
  if (lexem.type === 'selection-statement') {
    //console.log('selection-statement', lexem);
    index++;
    checking(lexTable, index);
  }
  if (lexem.type === 'iteration-statement') {
    //console.log('iteration-statement', lexem);
    index++;
    checking(lexTable, index);
  }
  return 'syntax is correct';
};

//isIfCorrect(lexems);
isLoopCorrect(lexems);
const tree = buildTree(lexems);
getTreeFormated(tree);
//console.log(lexems);
console.log(checking(lexems, 0));
