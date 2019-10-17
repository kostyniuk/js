'use strict';
const fs = require('fs');
const getAllSymbols = require('./4-symbols');

const data = fs.readFileSync('./6-tokens.json', 'utf8');
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

let typesAll = {};
const tokenTypes = {};

for (const operators in tokens.keyword['type-operator']) {
  Object.assign(typesAll, tokens.keyword['type-operator']);
  Object.assign(tokenTypes, tokens.keyword['type-operator']);
}

typesAll = Object.keys(tokenTypes);
const typesTokenNames = Object.values(tokenTypes);


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

const isUnresolved = (table, str) => {
  let unresolved = str;
  const tokens = [];
  //console.log(table, str)
  for (const lexem of table) {
    tokens.push(lexem.token);
    unresolved = unresolved.replace(lexem.token, '').trim();
  }
  unresolved = unresolved.split(' ');
  if (Array.isArray(unresolved)) {
    unresolved = unresolved[0];
  }
  const index = str.indexOf(unresolved);
  return [unresolved, index];

};

let str = process.argv[2];
const original = process.argv[2];

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
  'int', 'float', 'char', 'double', 'long', 'for', 'while', 'void',
  'goto', 'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile'];

let expressions = str.split(';').slice(0, -1);
expressions = expressions.map(el => el.trim());


const getTokens = (expressions, string = '') => {

  let ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));
  let floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();
  floats = floats.filter((obj) => obj);
  let integers = expressions.map(el => el.match(/\d+/g)).flat();
  integers = integers.filter((obj) => obj);
  integers = eliminateFloatsFromInts(floats, integers);

  const keyWords = getReserved(str, reserved);
  ids = deleteCopies(ids.flat(), keyWords);

  const singleSymb = symbolsAll.filter(el => el.length === 1);
  const multipleSymb = symbolsAll.filter(el => el.length === 2);
  let symbolsUsed;
  if (!string) {
    symbolsUsed = getAllSymbols(str, singleSymb, multipleSymb);
  } else {
    symbolsUsed = getAllSymbols(string, singleSymb, multipleSymb);
  }
  

  return { keyWords,
    ids,
    floats,
    integers,
    symbolsUsed };
};

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

  return [lBr - rBr, lPr - rPr];
};

const lexemsSort = lexems => {
  return lexems.sort((a, b) => {
    const keyA = a.index;
    const keyB = b.index;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
};

const myTokens = getTokens(expressions);

let lexems = getIndexes(str, myTokens);
lexems = lexemsSort(lexems)




const unresolved = isUnresolved(lexems, original);
if (unresolved[0]) {
  console.log(`ERROR: Found unresolved symbol. \nSymbol '${unresolved[0]}' at ${unresolved[1]} index`);
  process.exit(1);
}

const getAssignments = (lexTable, types) => {

  const lexemsAll = lexTable;
  let semicolonBef = 0;
  let semicolonAft = 0;
  const indexesOfAssign = [];
  lexTable.forEach((lexem, i, lexems) => {
    if (lexems[i].name === 'ids') {
      if (lexems[i - 1]) {
        if (lexems[i - 1].type === 'type-operator') {
          lexemsAll[i].Type = lexems[i - 1].token;
        }
        if (lexems[i - 1].name === 'T_COMA_SEPARATOR') {

          for (let j = i; j > 0; j--) {
            if (lexTable[j].name === 'T_SEMICOLON') {
              semicolonBef = lexTable[j].index;
              break;
            }
          }
          for (let j = i; j < lexems.length; j++) {
            if (lexTable[j].name === 'T_SEMICOLON') {
              semicolonAft = lexTable[j].index;
              break;
            }
          }
          indexesOfAssign.push([semicolonBef, semicolonAft]);
        }
      }
    }
  });
  return indexesOfAssign;
};

const assignRanges = getAssignments(lexems, typesTokenNames);

const setTypes = (assignRanges, lexems) => {
  const divorcedExp = [];
  for (let i = 0; i < assignRanges.length; i++) {
    const start = assignRanges[i][0];
    const end = assignRanges[i][1];
    divorcedExp[i] = [];
    for (const lexem of lexems) {
      if (i === 0 && lexem === lexems[0]) { divorcedExp[i].push(lexems[0]) ;}
      if (lexem.index < end && lexem.index > start) divorcedExp[i].push(lexem);
    }
  }

  //console.log(divorcedExp)
  divorcedExp.map((arr) => {
    arr.map((lexem, indexP, parent) => {
      if (lexem.name === 'ids') {
        lexem.Type = parent[0].token;
        const index = lexems.indexOf(lexem);
        lexems[index] = lexem;
      }
    });
  });

  return [lexems, divorcedExp];
};

const inizializationTokens = setTypes(assignRanges, lexems)[1];
lexems = setTypes(assignRanges, lexems)[0];

const bracket = isOpenBracketBefore(lexems, lexems.length);
bracket.forEach((el) => {
  if (el !== 0) {
    console.log('ERROR: Quantity of brackets doesnt match');
    process.exit(1);
  }
});

const setArrayTypes = lexems => {
  const original = lexems;
  lexems.forEach((lexem, i, table) => {
    if(lexem.token === ']') {
      if (table[i - 1].type === 'ID' && table[i - 2].token === '[') {
        if (table[i - 3].Type) {
        original[i - 3].Type += `[${table[i - 1].token}]`;
        }
      } else {
        console.log('error with your array assignment', lexem.name, lexem.index);
        process.exit(1);
      }
    } 
  })
  return original;
  
};

 

const getOnlyAssignments = lexems => {
  const assignments = []
  let indexes = [];
  const indexesBeforeFirst = []
  lexems.forEach((lexem, i, table) => {
    if(lexem.token === ';') {
      //console.log(lexem)
      if (table[i - 1].name === 'integers' || table[i - 1].name === 'floats') {
        indexes.push((lexem.index))

        // }
      }  
    } 
  })
  lexems.forEach((lexem, i, arr) => {
    if (lexem.token === ';' && lexem.index < indexes[0]) indexesBeforeFirst.push(lexem.index)
  })
  indexes = [indexesBeforeFirst[indexesBeforeFirst.length - 1], ...indexes];
  for(let i = 0; i < indexes.length - 1; i++) {
    const start = indexes[i];
    const end = indexes[i + 1];
    assignments[i] = []
    for(let j = 0; j < lexems.length; j++) {
      if (lexems[j].index > start && lexems[j].index < end) assignments[i].push(lexems[j]) 
    }
  }
  return assignments;
};

const inizializationWithTypes = (lexems) => {
  const variables = {}
  for(const lexem of lexems) {
    if (lexem.Type) {
      const type = lexem.Type;
      variables[lexem.token] = { type }
    }
  }
  return variables;
}

const separationOfNamesAndValues = arr => {
  const result = [];
  const indexes = [];
  let start;
  let end;
  for(let i =0; i < arr.length; i++) {
    indexes[i] = [];
    for(let j = 0; j < arr[i].length; j++) {
      if(arr[i][j] === '[') start = j;
      if (arr[i][j] === ']') end = j;
    }
    if (start !== -1 && end !== -1) {
      indexes[i].push(start, end);
      const name = arr[i][0];
      const index = arr[i][2];
      const value = arr[i].slice(end + 2).join(' ');
      result.push({name, index, value})
    } else {
      const name = arr[i].splice(0, 1).join('');
      const value = arr[i].slice(1).join(' ');
      result.push({name, value});
    }
    start = -1;
    end = -1;
    
  }
  return result;
}



const addValues = (arrOfExpr, obj, lexems) => {
  //console.log(arrOfExpr);
  const data = [];
  arrOfExpr.forEach((expression, i, arr) => {
    data[i] = [];
    expression.forEach((lexem, j, parent) => {
      data[i].push(lexem.token);
    })
  })
  const arrOfVar = separationOfNamesAndValues(data);
  for(let i = 0; i < lexems.length; i++) {
    for(let j = 0; j < arrOfVar.length; j++) {
      if (lexems[i].token === arrOfVar[j].name) {
        if (lexems[i].Type) {
          if (lexems[i].Type[lexems[i].Type.length - 1] === ']') {
            if (lexems[i].Type[lexems[i].Type.length - 2] < arrOfVar[j].index ) {
              console.log(`ERROR: Index out of range: ${arrOfVar[j].name}[${arrOfVar[j].index}]`);
              process.exit(1);
            }
          }
          arrOfVar[j].type = lexems[i].Type;
        }
      }
    }
  }
  return arrOfVar
}

const isOneArrIncludesAntother = (arr1, arr2) => {
  for(let i = 0; i < arr1.length; i++) {
    let includes = false;
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) includes = true;
    }
    if (!includes)
    console.log( `You haven't created the variable, ${arr1[i]}`)
    process.exit(1)
    //return false;
  }
  //return true;
}

const calculations = (expression, table) => {
  let names = [];
  for(const obj of table) {
    names.push(obj.name)
  }
  names = Array.from(new Set(names));
  let expressions = expression.split(';');
  expressions.pop()
  expressions = expressions.map(el => el.trim());
  let ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));
  let idsFlatted = Array.from(new Set(ids.flat()));
  console.log({ names, idsFlatted })
  for(let i = 0; i < idsFlatted.length; i++) {
    let includes = false;
    for (let j = 0; j < names.length; j++) {
      //console.log('hj')
      if (idsFlatted[i] === names[j]) includes = true;
      //console.log(includes)
    }
    if (!includes) {
    console.log( `You haven't created the variable, ${idsFlatted[i]}`)
    process.exit(0)
    }
    //return false;
  }

  //isOneArrIncludesAntother(names, idsFlatted);
  const tokens = getTokens(expressions, expression);
  let lexems = getIndexes(expression, tokens);
  lexems = lexemsSort(lexems);
  for(const lexem of lexems) {
    for(const variable of table) {
      if (lexem.token === variable.name && !variable.index) {lexem.value = variable.value}
    }
  }
  for(let i = 0; i < idsFlatted.length; i++) {
    for(let j =0 ;j < lexems.length; j++) {
      if (idsFlatted[i] === lexems[j].token && lexems[j].value && lexems[j + 1].token !== '=') {
        for(const el of table) {
          if (el.name === idsFlatted[i]) {
            expression = expression.replace(lexems[j].token, el.value)
          }
        }
      }
    }
  }
  
  for(let obj of table) {
    if (obj.index) {
      const newName = `${obj.name}[${obj.index}]`
      table.push({ name: newName, value: obj.value, type: obj.type  });
      idsFlatted.push(newName);
    }
  }

  for(let i = 0; i < table.length; i++) {
    if(table[i].index) {
      table.splice(i, 1);
      i--;
    }
  }
  for(const variable of table) {
    if (expression.includes(variable.name) && expression[expression.indexOf(variable.name) + 1] !== '=') {
        expression = expression.replace(variable.name, variable.value);
    }
  }

  console.log(expression)
  let splitted = expression.split(';')
  splitted = splitted.map(el => el.trim())
  splitted.pop();
  splitted = splitted.map(el => el.split('='));
  const hash = {}
  for(let i = 0; i < splitted.length; i++) {
    hash[splitted[i][0]] = splitted[i][1]
  }
  console.log(hash);
  let results = []
  for(const el in hash) {
    results.push(eval(hash[el]));
  }
  console.log(results)
}

lexems  = setArrayTypes(lexems);
const arrOfAssign = getOnlyAssignments(lexems);
const variables = inizializationWithTypes(lexems);
const info = addValues(arrOfAssign, variables, lexems);
calculations('b=2*a[n]; n=d;', info);
//console.log(lexems);

const checking = (lexTable, index) => {
  if (index === lexTable.length) {
    console.log('Syntax is correct');
    process.exit(0);
  }
  const lexem = lexTable[index];
  if (index === 0 || lexTable[index - 1].name === 'T_SEMICOLON') {
    if (lexem.type !== 'ID') {
      if (lexem.type !== 'type-operator') {
        console.log(`ERROR: Expression cant start with the lexem \nlexem '${lexTable[index].token}' at ${lexTable[index].index} index`);
        process.exit(0);
      }
    }
  }

  if (lexem.type === 'ID') {

    if (lexTable[index - 1]) {
      if (lexTable[index - 1].type !== 'type-operator') {
        if (lexTable[index - 1].name !== 'T_SEMICOLON') {
          if (lexTable[index - 1].name !== 'T_COMA_SEPARATOR') {
            if (lexTable[index - 1].name !== 'T_LEFT_BRACKET') {
              if (lexTable[index - 1].type !== 'assignment_operator') {
                if (lexTable[index - 1].type !== 'unary-operator') {
                  console.log(`ERROR: Expression can't start with the lexem ${lexTable[index - 1].name}`);
                  process.exit(1);
                }
              }
            }
          }
        }
      }
    }

    //console.log('ID', lexem);
    if (lexTable[index + 1].type === 'assignment_operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'binary-operator' ||
      lexTable[index + 1].name === 'unary-operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'separator-operator') {
      index++;
      checking(lexTable, index);
    }
    if (lexTable[index + 1].type === 'ID') {
      console.log(`Error: id right after id, \nlexem '${lexTable[index + 1].token}' at ${lexTable[index + 1].index} index`);
      process.exit(0);
    }


    if (lexTable[index + 1].type === 'parenthesis-operator') {
      const isBrOpened = isOpenBracketBefore(lexTable, index);
      if (isBrOpened.leftBrIsOpen && isBrOpened.leftPrIsOpen) {
        console.log(isBrOpened.leftBrIsOpen, isBrOpened.leftPrIsOpen);
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
      if(lexTable[index + 1].token === ']') {
        index++;
        checking(lexTable, index);
      }
      console.log(`ERROR: Lexem ${lexTable[index + 1].token}, ${lexem.token}, ${lexTable[index - 1].token} can't be used at ${lexTable[index + 1].index} index`);

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
//    console.log('parenthesis-operator', lexem);
    if (lexem.name === 'T_LEFT_BRACKET' ||
    lexem.name === 'T_LEFT_PARENTHESIS') {
      if (lexTable[index - 1].name === 'integers' ||
      lexTable[index - 1].name === 'floats') {
        console.log(`ERROR: You should use [] operators only after ID, \nlexem '${lexTable[index - 1].token}' at index ${lexTable[index - 1].index}`);
        process.exit(0);
      }
      if (lexTable[index + 1].type === 'ID') {
        index++;
        checking(lexTable, index);
      } else {
        console.log(`ERROR: Something wrong with your brackets, \nlexem '${lexTable[index + 1].token}' at index ${lexTable[index + 1].index}`);
        process.exit(0);
      }
    }
    if (lexem.name === 'T_RIGHT_BRACKET') {
      if (lexTable[index + 1].type === 'ID') {
        console.log(`ERROR: You can't use ID right after brackets, \nlexem ${lexTable[index + 1].token} at index ${lexTable[index + 1].index}`);
        process.exit(0);
      }
      else {
        index++;
        checking(lexTable, index);
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
  if (lexem.type === 'type-operator') {
    //console.log('type-operator', lexem);
    index++;
    checking(lexTable, index);
  }
  if (lexem.type === 'separator-operator') {
    //console.log('separator-statement', lexem);
    index++;
    checking(lexTable, index);
  }
  return 'syntax is correct';
};

console.log(checking(lexems, 0));
