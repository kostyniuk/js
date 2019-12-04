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

const eliminateFloatsFromInts = (arrFl, arrInt) => {
  const flatArrFl = arrFl.flat();
  const flatArrInt = arrInt.flat();

  if (!flatArrFl) return flatArrInt;
  const parts = flatArrFl.map(element => element.split('.'));
  parts.forEach(arr =>
    arr.forEach(el => {
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

const regex2 = /\W+\d+[a-zA-Z_]+[a-zA-Z0-9_]*/;
//const regex2 = /\d+[a-zA-Z_]+[a-zA-Z0-9_]*/; //-
const cyrillicPattern = /[\u0400-\u04FF]/;
const notDetected = [];

const checkRules = expression => {
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

const reserved = [
  'if',
  'then',
  'else',
  'switch',
  'case',
  'default',
  'break',
  'int',
  'float',
  'char',
  'double',
  'long',
  'for',
  'while',
  'void',
  'goto',
  'auto',
  'signed',
  'const',
  'extern',
  'register',
  'unsigned',
  'return',
  'continue',
  'Enumerator',
  'sizeof',
  'struct',
  'typedev',
  'union',
  'volatile'
];

let expressions = str.split(';').slice(0, -1);

let action = process.argv[3].split(';').slice(0, -1);
expressions = expressions.map(el => el.trim());
action = action.map(el => el.trim());

const getTokens = (expressions, string = '') => {
  let ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));
  let floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();
  floats = floats.filter(obj => obj);
  //let integers = expressions.map(el => el.match(/\d+/g)).flat();
  let integers = expressions.map(el => el.match(/[-+]?\d+/gm)).flat();
  integers = integers.filter(obj => obj);
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
  console.log({symbolsUsed})
  if (symbolsUsed.length < 18) {
    console.log(symbolsUsed)
    fs.writeFileSync('actions.json', JSON.stringify(symbolsUsed));
  }

  return { keyWords, ids, floats, integers, symbolsUsed };
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
        if (typeof str === 'string') {
          str = str.replace(token, '.'.repeat(length));
        } else {
          str = str.map(el => el.replace(token, '.'.repeat(length)));
        }
      }
    }
  };
  exec(str, hash);
  return result;
};

const errorLogging = issue => {
  console.log(issue);
  process.exit(1);
  return;
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

  return [lBr - rBr, lPr - rPr];
};

const lexemsSort = lexems =>
  lexems.sort((a, b) => {
    const keyA = a.index;
    const keyB = b.index;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

const myTokens = getTokens(expressions);
const actTokens = getTokens(action);
actTokens.keyWords = [];
let symbol = fs.readFileSync('actions.json', 'UTF-8');
symbol = Array.from(symbol).filter(el => el!== '"');
console.log({symbol})
actTokens.symbolsUsed = symbol;
actTokens.symbolsUsed.push('+', '-', '*', '/');
let actLexems = getIndexes(process.argv[3], actTokens);
actLexems = lexemsSort(actLexems).filter(obj => obj.index !== -1);

let lexems = getIndexes(str, myTokens);
lexems = lexemsSort(lexems).filter(lexem => lexem.index !== -1);
console.log({lexems})

const main = () => {
  const unresolved = isUnresolved(lexems, original);
  if (unresolved[0]) {
    errorLogging(`ERROR: Found unresolved symbol. 
  Symbol '${unresolved[0]}' at ${unresolved[1]} index`);
    process.exit(1);
  }

  const getAssignments = lexTable => {
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
                semicolonBef = lexTable[j].index + 1;
                break;
              } else semicolonBef = 0;
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
    return [...new Set(indexesOfAssign)];
  };

  const assignRanges = getAssignments(lexems);

  const setTypes = (assignRanges, lexems) => {
    const divorcedExp = [];
    for (let i = 0; i < assignRanges.length; i++) {
      const start = assignRanges[i][0];
      const end = assignRanges[i][1];
      divorcedExp[i] = [];
      for (const lexem of lexems) {
        if (i === 0 && lexem === lexems[0]) {
          divorcedExp[i].push(lexems[0]);
        }
        if (lexem.index < end && lexem.index >= start)
          divorcedExp[i].push(lexem);
      }
    }
    divorcedExp.map(arr => {
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

  lexems = setTypes(assignRanges, lexems)[0];

  const bracket = isOpenBracketBefore(lexems, lexems.length);
  bracket.forEach(el => {
    if (el !== 0) {
      errorLogging('ERROR: Quantity of brackets doesnt match');
    }
  });

  const setArrayTypes = lexems => {
    const original = lexems;
    lexems.forEach((lexem, i, table) => {
      if (lexem.token === ']') {
        if (table[i - 1].type === 'ID' && table[i - 2].token === '[') {
          if (table[i - 3].Type) {
            original[i - 3].Type += `[${table[i - 1].token}]`;
          }
        } else {
          errorLogging('ERROR: Array assignment at index', lexem.index + '');
        }
      }
    });
    return original;
  };

  const getOnlyAssignments = lexems => {
    const assignments = [];
    let indexes = [];
    const indexesBeforeFirst = [];
    lexems.forEach((lexem, i, table) => {
      if (lexem.token === ';') {
        if (
          table[i - 1].name === 'integers' ||
          table[i - 1].name === 'floats'
        ) {
          indexes.push(lexem.index);

          // }
        }
      }
    });
    lexems.forEach(lexem => {
      if (lexem.token === ';' && lexem.index < indexes[0])
        indexesBeforeFirst.push(lexem.index);
    });
    indexes = [indexesBeforeFirst[indexesBeforeFirst.length - 1], ...indexes];
    for (let i = 0; i < indexes.length - 1; i++) {
      const start = indexes[i];
      const end = indexes[i + 1];
      assignments[i] = [];
      for (let j = 0; j < lexems.length; j++) {
        if (lexems[j].index > start && lexems[j].index < end)
          assignments[i].push(lexems[j]);
      }
    }
    return assignments;
  };

  const inizializationWithTypes = lexems => {
    const variables = {};
    for (const lexem of lexems) {
      if (lexem.Type) {
        const type = lexem.Type;
        const typeName = type.replace(/[^A-Za-z]/g, '');
        const keywords = Object.keys(tokenss.keyword['type-operator']);
        if (!keywords.includes(typeName)) {
          errorLogging(`ERROR: Wrong type: ${type} at ${lexem.index} index.`);
        }
        variables[lexem.token] = { type };
      }
    }
    return variables;
  };

  let creationStage = [];

  const separationOfNamesAndValues = arr => {
    const result = [];
    const indexes = [];
    let start;
    let end;
    for (let i = 0; i < arr.length; i++) {
      indexes[i] = [];
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === '[') start = j;
        if (arr[i][j] === ']') end = j;
      }
      if (start !== -1 && end !== -1) {
        indexes[i].push(start, end);
        const name = arr[i][0];
        const index = arr[i][2];
        const value = arr[i].slice(end + 2).join(' ');
        result.push({ name, index, value });
      } else {
        const name = arr[i].splice(0, 1).join('');
        const value = arr[i].slice(1).join(' ');
        result.push({ name, value });
      }
      start = -1;
      end = -1;
    }
    creationStage = [...result];
    return result;
  };

  const getArrThatLessThanInt = int => {
    const arr = [];
    for (let i = 0; i < int; i++) {
      arr.push(i);
    }
    return arr;
  };

  const sortArrOfObjByField = (arr, field) => {
    let withField = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][field]) {
        withField.push(arr[i]);
        arr.splice(i, 1);
        i--;
      }
    }
    withField = withField.sort((a, b) => {
      const keyA = a[field];
      const keyB = b[field];
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    return [...withField, ...arr];
  };

  const randomIntFromInterval = (
    min,
    max // min and max included
  ) => Math.floor(Math.random() * (max - min + 1) + min);
  const addValues = (arrOfExpr, obj, lexems) => {
    const keys = Object.keys(obj);
    const data = [];
    arrOfExpr.forEach((expression, i) => {
      data[i] = [];
      expression.forEach(lexem => {
        data[i].push(lexem.token);
      });
    });
    const namesVar = [];
    data.forEach(el => namesVar.push(el[0]));

    for (let i = 0; i < keys.length; i++) {
      if (!namesVar.includes(keys[i])) {
        //const random10000 = randomIntFromInterval(-10000, 10000);
        data.push([keys[i].toString(), '=', '1003' + '']);
      }
    }
    let arrOfVar = separationOfNamesAndValues(data);
    for (let i = 0; i < lexems.length; i++) {
      for (let j = 0; j < arrOfVar.length; j++) {
        if (lexems[i].token === arrOfVar[j].name) {
          if (lexems[i].Type) {
            if (lexems[i].Type[lexems[i].Type.length - 1] === ']') {
              const num = lexems[i].Type.match(/\d+/)[0];
              if (num - 1 < arrOfVar[j].index) {
                const variable = arrOfVar[j].name;
                const index = arrOfVar[j].index;
                errorLogging(
                  `ERROR: Index out of range: ${variable}[${index}]`
                );
              }
            }
            arrOfVar[j].type = lexems[i].Type;
          }
        }
      }
    }

    let max = 0;
    const indexes = [];
    let indexesAll = [];
    const res = [];
    arrOfVar = arrOfVar.map((record, i, table) => {
      if (!record.type) {
        errorLogging(`ERROR: 
      Unresolved value: ${record.name} at ${record.index} index.`);
      }
      if (record.index) {
        max = record.type.match(/\d+/)[0];
        indexes.push(parseInt(record.index));
        if (!table[i + 1].index) {
          indexesAll = getArrThatLessThanInt(max);
          res.push(record);
          for (let j = 0; j < indexesAll.length; j++) {
            if (!indexes.includes(indexesAll[j])) {
              const random10000 = randomIntFromInterval(-10000, 10000);
              res.push({
                name: record.name,
                index: indexesAll[j].toString(),
                value: random10000 + '',
                type: record.type
              });
            }
          }
          record = '';
        }
      }

      if (record) res.push(record);

      return record;
    });
    const final = sortArrOfObjByField(res, 'index');
    return final;
  };

  const getOutput = table => {
    for (const variable of table) {
      const { name, type, value } = variable;
      if (variable.type === 'double') {
        const output = `'${name}': ${type} {${value}.0}`;
        console.log(output);
      } else {
        const output = `'${name}': ${type} {${value}}`;
        console.log(output);
      }
    }
  };

  const makeArr = table => {
    let arr = [];
    let name;
    let type = '';
    for (let i = 0; i < table.length; i++) {
      if (table[i].name.includes('[')) {
        const index = table[i].name.indexOf('[');
        name = table[i].name.slice(0, index);
        type = table[i].type;
        arr.push(table[i].value);
      }
    }

    for (let i = 0; i < table.length; i++) {
      if (table[i].name.includes(name)) {
        table.splice(i, 1);
        i--;
      }
    }
    if (type.includes('double')) {
      arr = arr.map(el => `${el}.0`);
    }
    table.push({ name, value: arr, type });
    return table;
  };

  const evalContentOfBrackets = exp => {
    let str = exp;
    let flag = true;
    const results = [];
    while (flag) {
      let start = str.indexOf('[');
      let end = str.indexOf(']');
      const expression = str.substring(start + 1, end);
      results.push({ from: start, to: end, expression });
      str = str.replace('[', ';');
      str = str.replace(']', ';');
      start = str.indexOf('[');
      end = str.indexOf(']');
      if (start === -1) flag = false;
    }
    for (let i = 0; i < results.length; i++) {
      const beginning = exp.slice(0, results[i].from + 1);
      const last = exp.slice(results[i].to);
      exp = `${beginning}${eval(results[i].expression)}${last}`;
    }
    return exp;
  };

  let operations;
  let numbers = [];
  const calculationAsmCodeGen = (str, lexems) => {
    lexems = lexems.map((lexem, i, arr) => {
      if (lexem.value && arr[i + 1].token === ']') {
        lexem.token = lexem.value;
      }
      if (lexem.name === 'integers' || lexem.name === 'floats') {
        numbers.push(lexem.token);
      }
      return lexem;
    });
    //console.log(str, lexems)
    const exps = str
      .split(';')
      .filter(el => !!el)
      .map(el => el.trim());
    //console.log(exps, lexems);
    const before = [];
    const after = [];
    let scIndexes = [0];
    const expsArr = [];

    lexems.forEach(el => {
      if (el.token === ';') {
        scIndexes.push(el.index);
      }
    });

    scIndexes = scIndexes
      .map((el, i, arr) => {
        if (i !== 0) {
          return [arr[i - 1], arr[i]];
        }
      })
      .filter(el => !!el);

    for (let i = 0; i < scIndexes.length; i++) {
      expsArr[i] = [];
    }

    lexems.forEach(el => {
      for (let i = 0; i < scIndexes.length; i++) {
        if (el.index >= scIndexes[i][0] && el.index <= scIndexes[i][1]) {
          expsArr[i].push(el);
        }
      }
    });

    let divided = expsArr;
    divided = divided.map(() => ({ before: [], after: [] }));

    //console.log(expsArr)

    expsArr.forEach((arr, i) => {
      arr.forEach((lex, j, arrOfExp) => {
        if (lex.token === '=') {
          for (let k = 0; k < arrOfExp.length; k++) {
            if (arrOfExp[k].token !== ';' && arrOfExp[k].token !== '=') {
              if (k < j) {
                divided[i].before.push(arrOfExp[k]);
              } else {
                divided[i].after.push(arrOfExp[k]);
              }
            }
          }
        }
      });
    });

    const parts = {
      '*': [],
      '/': [],
      '+': [],
      '-': []
    };

    const signs = Object.keys(parts);
    //console.log(signs);

    //console.log(divided[0].after)
    divided.forEach((el, i, arr) => {
      const aft = el.after;
      const signss = [];
      aft.forEach((lexem, j, lexems) => {
        if (lexems[j].token === '[' && lexems[j - 1].type === 'ID') {
          lexems[j - 1].token +=
            lexems[j].token + lexems[j + 1].token + lexems[j + 2].token;
          //console.log(lexems[j-1])
          const index = lexems.indexOf(lexems[j]);
          lexems.splice(index, 3);
          //console.log({lexems})
        }
      });
      aft.forEach((lexem, j, lexems) => {
        signs.forEach((sign, k, signs) => {
          if (sign === lexem.token) {
            //console.log(sign)
            parts[lexem.token].push([
              lexems[j - 1].token,
              lexem.token,
              lexems[j + 1].token,
              i
            ]);
          }
        });
      });
    });
    //console.log(divided[0])

    operations = {
      multiplication: parts['*'],
      divide: parts['/'],
      add: parts['+'],
      substract: parts['-']
    };
  };

  let expForAssembly;

  const calculations = (expression, table, variables) => {
    let names = [];
    for (const obj of table) {
      names.push(obj.name);
    }
    names = Array.from(new Set(names));
    let expressions = expression.split(';');
    expressions.pop();
    expressions = expressions.map(el => el.trim());
    //console.log({el: expressions})

    const ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));
    const idsFlatted = Array.from(new Set(ids.flat()));
    for (let i = 0; i < idsFlatted.length; i++) {
      let includes = false;
      for (let j = 0; j < names.length; j++) {
        if (idsFlatted[i] === names[j]) includes = true;
      }
      if (!includes) {
        console.log(`You haven't created the variable, ${idsFlatted[i]}`);
        process.exit(0);
      }
    }

    const tokens = getTokens(expressions, expression);
    //console.log(tokens)
    //process.exit(1)
    let lexems = getIndexes(expression, tokens);
    lexems = lexemsSort(lexems);
    for (const lexem of lexems) {
      for (const variable of table) {
        if (lexem.token === variable.name && !variable.index) {
          lexem.value = variable.value;
        }
      }
    }

    lexems = lexems.filter(lex => lex.index !== -1);

    const idLexems = lexems.filter(lexem => {
      if (
        lexem.name === 'ids' ||
        lexem.token === '=' ||
        lexem.token === ';' ||
        lexem.token === '[' ||
        lexem.token === ']'
      )
        return lexem;
    });

    let scIndexes = [0];
    const expsArr = [];

    idLexems.forEach(el => {
      if (el.token === ';') {
        scIndexes.push(el.index);
      }
    });

    scIndexes = scIndexes
      .map((el, i, arr) => {
        if (i !== 0) {
          return [arr[i - 1], arr[i]];
        }
      })
      .filter(el => !!el);

    for (let i = 0; i < scIndexes.length; i++) {
      expsArr[i] = [];
    }

    idLexems.forEach(el => {
      for (let i = 0; i < scIndexes.length; i++) {
        if (el.index >= scIndexes[i][0] && el.index <= scIndexes[i][1]) {
          expsArr[i].push(el);
        }
      }
    });

    let divided = expsArr;
    divided = divided.map(() => ({ before: [], after: [] }));

    expsArr.forEach((arr, i) => {
      arr.forEach((lex, j, arrOfExp) => {
        if (lex.token === '=') {
          for (let k = 0; k < arrOfExp.length; k++) {
            if (k < j) {
              divided[i].before.push(arrOfExp[k]);
            } else {
              divided[i].after.push(arrOfExp[k]);
            }
          }
        }
      });
    });

    divided = divided.map(obj => {
      obj.after = obj.after.map((lex, i, arr) => {
        if (lex.name === 'ids' && arr[i - 1].token !== '[') return lex;
      });
      obj.after = obj.after.filter(el => !!el);
      obj.before = obj.before.map(lex => {
        if (lex.name === 'ids') return lex;
      });
      obj.before = obj.before.filter(el => !!el);

      return obj;
    });

    divided = divided.map(obj => {
      obj.before.map(lexem => {
        lexem.Type = variables[lexem.token].type;
        return lexem;
      });
      obj.after.map(lexem => {
        lexem.Type = variables[lexem.token].type;
        return lexem;
      });
      return obj;
    });

    divided.forEach(el => {
      const before = el.before;
      const after = el.after;
      for (let i = 0; i < after.length; i++) {
        if (!after[i].Type.includes(before[0].Type)) {
          if (after[i].Type !== 'short' || before[i].Type !== 'double') {
            if (before[i].Type !== 'double[4]') {
              errorLogging(`ERROR: Wrong expression. 
        You can't assign '${after[i].token}' with '${after[i].Type}' type
        to variable '${before[i].token}' with '${before[i].Type}' type.`);
              process.exit(1);
            }
          }
        }
      }
    });
    //console.log({div:divided[0].after})

    //console.log(table);
    for (let i = 0; i < idsFlatted.length; i++) {
      for (let j = 0; j < lexems.length; j++) {
        if (idsFlatted[i] === lexems[j].token && lexems[j].value) {
          if (lexems[j + 1].token !== '=') {
            for (const el of table) {
              if (el.name === idsFlatted[i]) {
                if (lexems[j - 1].token === '[') {
                  //const index = expression.lastIndexOf(lexems[j].token);
                  expression = expression.replace(lexems[j].token, el.value);
                }
              }
            }
          }
        }
      }
    }

    //console.log(expression, idsFlatted);

    calculationAsmCodeGen(expression, lexems);

    for (const obj of table) {
      if (obj.index) {
        const newName = `${obj.name}[${obj.index}]`;
        table.push({ name: newName, value: obj.value, type: obj.type });
        idsFlatted.push(newName);
      }
    }

    for (let i = 0; i < table.length; i++) {
      if (table[i].index) {
        table.splice(i, 1);
        i--;
      }
    }

    expForAssembly = expression;

    const evalled = evalContentOfBrackets(expression);
    expression = evalled;

    expression = expression.replace(/ /g, '');

    for (let i = 0; i < table.length; i++) {
      if (expression.includes(table[i].name)) {
        if (expression[expression.indexOf(table[i].name) + 1] !== '=') {
          expression = expression.replace(table[i].name, table[i].value);
          i--;
          continue;
        }
        if (expression[expression.indexOf(table[i].name) + 1] === '=') {
          expression = expression.replace(
            table[i].name,
            table[i].name.toUpperCase()
          );
          i--;
        }
      }
    }

    //console.log({ table });

    const shorts = table
      .filter(obj => obj.type === 'short')
      .map(obj => {
        if (obj.value.includes('.')) {
          console.log(
            `ERROR: You can't assign float to short variable. Variable ${obj.name}`
          );
          process.exit(1);
        }
      });

    //console.log({ expressione: expression });

    const floatFinder = /[[0-9]+[.][0-9]+]/g;

    //const regex2 = /\d+[a-zA-Z_]+[a-zA-Z0-9_]*/; //-

    const floatInsBrac = expression.match(floatFinder);
    if (floatInsBrac) {
      console.log(
        `ERROR: Index of array should be integer, find ${
          floatInsBrac[0]
        } at index ${actions.indexOf('[')}`
      );
      process.exit(1);
    }
    expression = expression.toLowerCase();
    //console.log(expression);

    let splitted = expression.split(';');
    splitted = splitted.map(el => el.trim());
    splitted.pop();
    splitted = splitted.map(el => el.split('='));

    //console.log(splitted);
    const exprs = splitted.map(arr => arr[1]);

    //console.log({exprs});

    const hash = {};
    for (let i = 0; i < splitted.length; i++) {
      hash[splitted[i][0]] = splitted[i][1];
    }

    const results = [];
    for (const el in hash) {
      try {
        const value = eval(hash[el]);
        results.push({ name: el, value });
      } catch (e) {
        console.log(
          `ERROR: You haven't define the variable to assign to ${el}`
        );
        process.exit(1);
      }
    }

    console.log(results);

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < results.length; j++) {
        if (table[i].name === results[j].name) {
          table[i].value = results[j].value;
        }
      }
    }
    //console.log({ here: table });
    table = makeArr(table);
    getOutput(table);
  };

  const actions = process.argv[3];

  lexems = setArrayTypes(lexems);
  // let checkShort = lexems.filter(lexem => lexem.Type === 'short');
  // console.log(checkShort);
  // process.exit(1);
  let vars = lexems.filter(lexem => lexem.Type).map(obj => obj.token);
  vars = vars.filter((item, index, arr) => {
    if (arr.indexOf(item) !== index) {
      console.log(
        `ERROR: Variable ${item} has already been declared at index ${str.indexOf(
          item
        )}`
      );
      process.exit(1);
    }
  });

  const isEndGood = lexems => {
    if (!lexems[lexems.length - 1].token === ';') {
      console.log("ERROR: Expression should be followed with ';'");
      process.exit(1);
    }
  };
  isEndGood(lexems);
  if (actions[actions.length - 1] !== ';') {
    console.log("ERROR: Expression should be followed with ';'");
    process.exit(1);
  }

  //console.log({creationStage});

  const arrOfAssign = getOnlyAssignments(lexems);

  const variables = inizializationWithTypes(lexems);

  const info = addValues(arrOfAssign, variables, lexems);
  //console.log(info)
  const a = () => [...creationStage];
  const b = [...a()];
  const c = { data: b };
  fs.writeFileSync('help.json', JSON.stringify(c));
  //console.log({creationStage})
  calculations(actions, info, variables);

  console.log(expForAssembly);
  let splitted = expForAssembly.split(';');
  splitted = splitted.map(el => el.trim());
  splitted.pop();
  splitted = splitted.map(el => el.split('='));
  splitted = splitted.map(arr => arr.map(lexem => lexem.trim()));
  splitted = splitted.map(arr => arr.map(expr => expr.split('*')));
  //console.log(splitted)
  // here
  numbers = numbers.map((number, i, arr) => {
    const name = 'CONSTANT_' + ++i;
    return { [name]: number };
  });

  // rgr
  creationStage = JSON.parse(fs.readFileSync('help.json', 'utf-8')).data;
  creationStage = creationStage.filter(obj => obj.value !== '1003');
  //console.log(creationStage)
  numbers.forEach((obj, i, arr) => {
    creationStage.push({
      name: Object.keys(obj)[0],
      value: Object.values(obj)[0]
    });
  });
  creationStage = creationStage.map(obj => {
    return {
      ...obj,
      intPart: obj.value.split('.')[0],
      floatPart: obj.value.split('.')[1] || '0'
    };
  });

  //console.log({ creationStage });

  const helper = require('./doublepoint');
  const int = 2;
  const float = 3;

  const makeIEE754Hex = (int, float) => {
    const iee754 = helper.makeIEE754(int, float);
    const hexIee754 = helper.binToHex(iee754);
    const decIee754 = helper.hexToDec(hexIee754);
    return decIee754;
  };

  //console.log({one: makeIEE754Hex(1, 0)})
  //console.log({two: makeIEE754Hex(0, 0)})

  function compare(a, b) {
    if (a[a.length - 1] < b[b.length - 1]) {
      return -1;
    }
    if (a[a.length - 1] > b[b.length - 1]) {
      return 1;
    }
    return 0;
  }

  //eax - 32
  //console.log()
  let counter = 0;
  let operationsModified = Object.values(operations)
    .filter(arr => arr.length)
    .flat();
  //console.log(operationsModified)
  const exprNumber = Math.max(
    ...operationsModified.map((el, i, arr) => el[el.length - 1])
  );
  //console.log({exprNumber})

  const signsAvailable = ['+', '-', '*', '/'];
  operationsModified = operationsModified.sort(compare);
  //console.log(exprNumber, operationsModified)

  let flatted = operationsModified.flat();
  flatted = Array.from(new Set(flatted));
  //console.log({flatted})

  let xmms = [];

  const movupss = [''];

  splitted.forEach((arr, i, table) => {
    if (arr[1].toString().length === 1) {
      //console.log({fuck: arr[1]})
      // if (arr[0].toString() !== str[str.length-1]s
      // console.log('movups xmm' + counter +', ' + arr[0][0])
      // movupss.push('movups xmm' + counter +', ' + arr[0][0])
      // xmms.push({['xmm' + counter]: arr[0][0]})
      // counter++;

      //console.log('movups xmm' + counter +', ' + arr[1][0])
      movupss.push('movups xmm' + counter + ', ' + arr[1][0]);
      xmms.push({ ['xmm' + counter]: arr[1][0] });
      counter++;

      if (arr[0].toString().length === 1) {
        //console.log({xmms})
        console.log({ arr: arr[0].toString() });
        const values = [];
        xmms.forEach(obj => {
          values.push(Object.values(obj)[0]);
        });
        if (!values.includes(arr[0].toString())) {
          movupss.push('movups xmm' + counter + ', ' + arr[0][0]);
          xmms.push({ ['xmm' + counter]: arr[0][0] });
          counter++;
        }

        //console.log(values)
        //movupss.forEach((str, index) => {
        //console.log({str: str[str.length-1], index})
        //console.log(arr[0].toString())
        //if (arr[0].toString() !== str[str.length-1]){
        //console.log('Adding')

        //index++;
      }
    } else if (arr[0].toString().length === 1) {
      //console.log({isNhere: arr[0]})
      movupss.forEach((str, index) => {
        //console.log({str, index})
        if (arr[0].toString() !== str[str.length - 1]) {
          //console.log('Adding')
          movupss[i] = 'movups xmm' + counter + ', ' + arr[0][0];
          xmms.push({ ['xmm' + counter]: arr[0][0] });
          counter++;
          index--;
        }
        if (
          arr[1].toString() !== str[str.length - 1] &&
          arr[1].toString().length === 4
        ) {
          //console.log({ar: arr[1]})
          const arrName = arr[1][0].slice(0, arr[1][0].indexOf('['));
          const arrIndex = arr[1][0].slice(
            arr[1][0].indexOf('[') + 1,
            arr[1][0].indexOf(']')
          );
          //console.log('array', arrName, arrIndex)
          movupss.push('mov esi, ' + arrIndex);
          movupss.push(
            'movups xmm' + counter + ', ' + '[4 * esi] + ' + arrName
          );
          xmms.push({ ['xmm' + counter]: `${arrName}[${arrIndex}]` });

          counter++;
        }
        //console.log('adsssssssssssss')
      });
    } else if (arr[0].toString().length > 1) {
      movupss.forEach((str, index) => {
        //console.log({str, index})
        if (arr[0].toString() !== str[str.length - 1] || str === '') {
          const arrName = arr[0][0].slice(0, arr[0][0].indexOf('['));
          const arrIndex = arr[0][0].slice(
            arr[0][0].indexOf('[') + 1,
            arr[0][0].indexOf(']')
          );
          //console.log('array', arrName, arrIndex)
          movupss[i] = 'mov esi, ' + arrIndex;
          movupss[i + 1] =
            'movups xmm' + counter + ', ' + '[4 * esi] + ' + arrName;

          // movupss[i] = '' ,'movups xmm' + counter +', ' + arr[0][0]
          // xmms.push({['xmm' + counter]: arr[0][0]})
          counter++;
          index--;
        }
        //console.log('adsssssssssssss')
      });
    }
  });

  console.log({ flatted });

  for (let i = 0; i < 1; i++) {
    //operationsModified.forEach((expr, i, arr) => {
    flatted.forEach((str, k, exprs) => {
      if (!signsAvailable.includes(str)) {
        if (typeof str !== 'number') {
          if (str.includes('[')) {
            //movups xmm3, [4 * esi] + a
            const arrName = str.slice(0, str.indexOf('['));
            const arrIndex = str.slice(str.indexOf('[') + 1, str.indexOf(']'));
            // console.log('array', str, arrName, arrIndex)
            movupss.push('mov esi, ' + arrIndex);
            movupss.push(
              'movups xmm' + counter + ', ' + '[4 * esi] + ' + arrName
            );

            //console.log('mov esi, '+ arrIndex)
            //console.log('movups xmm' + counter + ', ' + '[4 * esi] + ', arrName);
            xmms.push({ ['xmm' + counter]: str });

            counter++;
          } else if (parseFloat(str)) {
            //console.log('Constant', str)
            let varName;
            creationStage.forEach((varObj, index, ar) => {
              if (varObj.value === str) {
                varName = varObj.name;
              }
            });
            movupss.push('movups xmm' + counter + ', ' + varName);

            //console.log('movups xmm' + counter + ', ' + varName);
            xmms.push({ ['xmm' + counter]: str });
            counter++;
          } else {
            const alreadyThere = [];
            console.log('variable', str, xmms);
            xmms.forEach(obj => alreadyThere.push(Object.values(obj)[0]));
            console.log({ alreadyThere });
            if (!alreadyThere.includes(str)) {
              movupss.push('movups xmm' + counter + ', ' + str);

              console.log('movups xmm' + counter + ', ' + str);
              xmms.push({ ['xmm' + counter]: str });

              counter++;
            }
          }
        }
      }
    });

    //})
  }

  //console.log(xmms)
  //console.log({movupss})

  let counterExpr = 0;
  for (let i = 0; i < operationsModified.length; i++) {
    for (let j = 0; j < xmms.length; j++) {
      const variable = Object.values(xmms[j])[0];
      const key = Object.keys(xmms[j]).find(key => xmms[j][key] === variable);
      if (operationsModified[i].includes(variable)) {
        if (counterExpr === 0) {
          const index = operationsModified[i].indexOf(variable);
          operationsModified[i][index] = key;
        }
      }
    }
  }

  let dividedByExpr = [[]];

  let counterE = 0;
  for (let i = 0; i < operationsModified.length; i++) {
    if (operationsModified[i][operationsModified[i].length - 1] === counterE) {
      dividedByExpr[counterE].push(operationsModified[i]);
    } else {
      i--;
      counterE++;
      dividedByExpr[counterE] = [];
    }
  }

  //console.log(operationsModified)
  //console.log(dividedByExpr)

  let firstXmm;
  let secondXmm;

  const sseTransform = {
    '+': 'addss',
    '-': 'subss',
    '*': 'mulss',
    '/': 'divss'
  };

  let resultss = [];

  console.log(dividedByExpr)

  dividedByExpr = dividedByExpr.map((arr, i, table) => {
    arr.map((exp, j, exprs) => {
      if (j === 0) {
        console.log(exp)
        firstXmm = exp[0];
        secondXmm = exp[2];
        exp[1] = sseTransform[exp[1]];
        resultss.push([exp[1], exp[0].concat(','), exp[2]]);
      } else {
        console.log({exp, firstXmm, secondXmm})
        if (exp.includes(firstXmm)) {
          exp[1] = sseTransform[exp[1]];
          console.log({exp, firstXmm})
          const index = exp.indexOf(firstXmm);
          if (index !== 0) {
            let temp = exp[0];
            exp[0] = exp[2];
            exp[2] = temp;
          }
          resultss.push([exp[1], exp[2].concat(','), exp[0]]);
          console.log(resultss)
          console.log({resL : [exp[1], exp[2], exp[0]]}) // need to be checked
          return [exp[0], exp[1], exp[2]];
        } else if (exp.includes(secondXmm)) {
          exp[1] = sseTransform[exp[1]];
          const index = exp.indexOf(secondXmm);
          if (index !== 0) {
            let temp = exp[0];
            exp[0] = exp[2];
            exp[2] = temp;
          }
          exp[0] = firstXmm;
          resultss.push([exp[1], exp[0].concat(','), exp[2]]);

          return [exp[0], exp[1], exp[2]];
        }
      }
    });
  });

  resultss = resultss.map(expr => expr.join(' '));
  movupss.push(...resultss);

  //console.log(movupss)
  const popping = [];
  //console.log({sp: splitted[1]})
  splitted.forEach((arr, i, table) => {
    arr.forEach((part, j, expression) => {
      if (
        j === 1 &&
        part.toString().length !== 1 &&
        (j === 1 && part.toString().length !== 4)
      ) {
        if (part[0].length !== 4 && part[0].length !== 1) {
          part[0] = part[0].split(' ')[0];
          //console.log({ad: part[0]})
        }
        console.log({ part });
        const assignment = part[0].trim();
        let variable = expression[0][0];
        //console.log({variable, assignment})
        xmms.forEach((obj, i, table) => {
          if (Object.values(obj)[0] === assignment) {
            //console.log('Found ', assignment)
            const register = Object.keys(obj)[0];
            //console.log({previous: movupss[movupss.length - 1]})
            if (
              movupss[movupss.length - 1] !== `movups ${variable}, ${register}`
            ) {
              if (variable.length === 4) {
                const arrName = arr[1][0].slice(0, arr[1][0].indexOf('['));
                const arrIndex = arr[1][0].slice(
                  arr[1][0].indexOf('[') + 1,
                  arr[1][0].indexOf(']')
                );
                variable = `[4 * ${arrIndex}] + ${arrName}`;
              }
              movupss.push(`movups ${variable}, ${register}`);
            }
          }
        });
      }
      if (
        (j === 1 && part.toString().length === 1) ||
        (j === 1 && part.toString().length === 4)
      ) {
        let variable = expression[0][0];
        const assignment = part[0]; // need to be space here

        xmms.forEach((obj, i, table) => {
          if (Object.values(obj)[0] === assignment) {
            //console.log('Found ', variable);
            const register = Object.keys(obj)[0];
            //console.log({movupss})
            if (variable.length === 4) {
              const arrName = arr[1][0].slice(0, arr[1][0].indexOf('['));
              const arrIndex = arr[1][0].slice(
                arr[1][0].indexOf('[') + 1,
                arr[1][0].indexOf(']')
              );
              variable = `[4 * ${arrIndex}] + ${arrName}`;
              if (
                movupss[movupss.length - 1] !==
                `movups ${variable}, ${register}`
              ) {
                movupss.push(`movups ${variable}, ${register}`);
              }
            } else {
              const ex = `movups ${variable}, ${register}`;
              console.log({ variable, register, movupss });
              if (
                movupss[movupss.length - 1] !==
                `movups ${variable}, ${register}`
              ) {
                movupss.push(`movups ${variable}, ${register}`);
              }
            }
          }
        });
      }
    });
  });

  console.log(movupss);

  const movHandlerCreation = (obj, i, table) => {
    // ; a[0] : = 1
    //     mov eax, 1075303564
    //     mov dword ptr[a + 0], eax
    if (obj.index) {
      return `
mov eax, ${makeIEE754Hex(obj.intPart, obj.floatPart)}
mov dword ptr[a+${obj.index * 4}], eax  // ${obj.name}[${obj.index}] = ${
        obj.value
      }
  `;
    }
    return `
mov ${obj.name}, ${makeIEE754Hex(obj.intPart, obj.floatPart)} //${obj.name} = ${
      obj.value
    }`;
  };

  //movupsHandlerCreation

  const output = creationStage.map((obj, i, arr) =>
    movHandlerCreation(obj, i, arr)
  );
  output.push('\n\n');
  let final = [output.join(''), movupss.join('\n')];
  final = final.join('');

  //console.log(final)
  //const final = output.join(''), movupss.join('\n'));
  // console.log(finalArr)
  const time = new Date().now;
  const path = './rgr-tests/a' + '.asm';
  fs.writeFileSync(path, final);
};



//console.log(makeIEE754Hex(0, 0));

// #include <iostream>
// #include <string>
// using namespace std;
// double b, a[4];  short n,d; b=2*a[n]; b=d;
// int main()
// {

//   double b00 = 4;
//   double a11 = 4.2;
//   short d00 = 20;

//   float b0 = (float)b00;
//   float a10 = (float)a11;
//   float d0 = (float)d00;

//   float a[4];

//   float d;
//   float a1;
//   float b;
//   float param1 = 2;

//   __asm {
//     // probable need to assign variables here
//     ; a[0] : = 1
//     mov eax, 1075303564
//     mov dword ptr[a + 0], eax
//     ; a[1] : = 2
//     mov eax, 1075303564
//     mov dword ptr[a + 4], eax
//     ; a[2] : = 3
//     mov eax, 1075303564
//     mov dword ptr[a + 8], eax
//     ; a[3] : = 4
//     mov eax, 1035303564
//     mov dword ptr[a + 12], eax
//     //mov b, 1075303564
//     mov esi, 3
//     movups xmm0, b;
//     movups xmm1, a10;
//     movups xmm2, param1
//     movups xmm3, [4 * esi] + a
//     //movups xmm3, d0;
//     addss xmm3, xmm2 // + return result to first parametr
//     //subss xmm1, xmm2 // - return result to first parametr
//     //mulss xmm1, xmm2 // * return result to first parametr
//     //divss xmm1, xmm2 // / return result to first parametr

//     //mulss xmm0, xmm1;

//     movups b, xmm3;
//     //movups a1, xmm0;
//     //movups d, xmm3;
//   };

//   for (int i = 0; i < 4; i++)
//     cout << a[i] << " \n";
//   cout << b << " ";
//   //cout << a1 << " ";
//   //cout << d << " ";

//   cout << "Press Enter...";
//   string t;
//   getline(cin, t);
// }
//console.log(actTokens);
//console.log({ actLexems });
let coun = 0;

const checking = (lexTable, index) => {
  if (index === lexTable.length - 1) {
    coun++;
    console.log('Syntax1 is correct');
    if (coun === 1) checking(lexems, 0);
    if (coun === 2) console.log('Its ok');
    main();
    process.exit(0);
  }
  //console.log(lexems[index])
  const lexem = lexTable[index];
  if (index === 0 || lexTable[index - 1].name === 'T_SEMICOLON') {
    if (lexem.type !== 'ID') {
      if (lexem.type !== 'type-operator') {
        console.log(lexem);
        console.log(
          `ERROR: Expression cant start with the lexem \nlexem '${lexTable[index].token}' at ${lexTable[index].index} index`
        );
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
                  console.log(
                    `ERROR: Expression can't start with the lexem ${lexTable[index - 1].name}`
                  );
                  process.exit(1);
                }
              }
            }
          }
        }
      }
    }

    console.log('ID', lexem);
    if (
      lexTable[index + 1].type === 'assignment_operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'binary-operator' ||
      lexTable[index + 1].name === 'unary-operator' ||
      lexTable[index + 1].type === 'unary-operator' ||
      lexTable[index + 1].type === 'separator-operator'
    ) {
      index++;
      checking(lexTable, index);
    }
    if (lexTable[index + 1].type === 'ID') {
      console.log(
        `Error: id right after id, \nlexem '${lexTable[index + 1].token}' at ${lexTable[index + 1].index} index`
      );
      process.exit(0);
    }

    if (lexTable[index + 1].type === 'parenthesis-operator') {
      const isBrOpened = isOpenBracketBefore(lexTable, index);
      if (isBrOpened.leftBrIsOpen && isBrOpened.leftPrIsOpen) {
        console.log(isBrOpened.leftBrIsOpen, isBrOpened.leftPrIsOpen);
        if (
          lexTable[index + 1].name === 'T_RIGHT_BRACKET' ||
          lexTable[index + 1].name === 'T_RIGHT_PARANTHESIS'
        ) {
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
      if (
        lexTable[index + 1].name === 'T_LEFT_PARENTHESIS' ||
        lexTable[index + 1].name === 'T_LEFT_BRACKET'
      ) {
        index++;
        checking(lexTable, index);
      }
      if (lexTable[index + 1].token === ']') {
        index++;
        checking(lexTable, index);
      }
      console.log(
        `ERROR: Lexem ${lexTable[index + 1].token}, ${lexem.token}, ${lexTable[index - 1].token} can't be used at ${lexTable[index + 1].index} index`
      );

      process.exit(0);
    }
  }
  if (lexem.type === 'assignment_operator') {
    //console.log('assignment_operator', lexem);

    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log(
        `ERROR: You can assing only ID variables, \nlexem ${lexTable[index + 1].token} at ${lexTable[index + 1].index}`
      );
      process.exit(0);
    }
  }
  if (lexem.type === 'unary-operator') {
    //console.log('unary-operator', lexem);
    if (lexTable[index + 1].type === 'ID') {
      index++;
      checking(lexTable, index);
    } else {
      console.log(
        `ERROR: Unary operators can be used only after IDs, \nlexem ${lexTable[index + 1].token} at ${lexTable[index + 1].index}`
      );
      process.exit(0);
    }
  }
  if (lexem.type === 'parenthesis-operator') {
    //    console.log('parenthesis-operator', lexem);
    if (
      lexem.name === 'T_LEFT_BRACKET' ||
      lexem.name === 'T_LEFT_PARENTHESIS'
    ) {
      if (
        lexTable[index - 1].name === 'integers' ||
        lexTable[index - 1].name === 'floats'
      ) {
        console.log(
          `ERROR: You should use [] operators only after ID, \nlexem '${lexTable[index - 1].token}' at index ${lexTable[index - 1].index}`
        );
        process.exit(0);
      }
      if (lexTable[index + 1].type === 'ID') {
        index++;
        checking(lexTable, index);
      } else {
        console.log(
          `ERROR: Something wrong with your brackets, \nlexem '${lexTable[index + 1].token}' at index ${lexTable[index + 1].index}`
        );
        process.exit(0);
      }
    }
    if (lexem.name === 'T_RIGHT_BRACKET') {
      if (lexTable[index + 1].type === 'ID') {
        console.log(
          `ERROR: You can't use ID right after brackets, \nlexem ${lexTable[index + 1].token} at index ${lexTable[index + 1].index}`
        );
        process.exit(0);
      } else {
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

checking(actLexems, 0);
