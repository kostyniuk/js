'use strict';

const expression = process.argv[2];
const expElemnts = expression.split(' ');
console.log(expElemnts);

const reserved = ['if', 'else', 'switch', 'case', 'default', 'break', 'int',
  'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void', 'goto',
  'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile'];



const symbols = [':', '+', '-', '*', '/', '%', '++', '--', '==', '!=', '>',
  '<',  '>=', '<=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>',
  '=', '+=', '-=', '*=', '/=', '<<=', '>>=', '&=', '^=', '|=', '(',
  ')', '[', ']', '?', '<>', '{', '}', ':', ';', '.',  ];

const results = [];
const symbolsUsed = [];
for (let i = 0; i < symbols.length; i++) {
  for (let j = 0; j < expElemnts.length; j++) {
    const temp = expElemnts[j].split(symbols[i]);
    if (temp.length > 1) {
      results.push(temp);
      symbolsUsed.push(symbols[i]);
    }
  }
}

const reservedUsed = [];
for (const word in reserved) {
  console.log(reserved[word]);
  if (expression.includes(reserved[word])) reservedUsed.push(reserved[word]);
}
console.log(reservedUsed);
//console.log(results, new Set(symbolsUsed));
//console.log(expression.includes('switch'));
const cyrillicPattern = /^[\u0400-\u04FF]+$/;

const numUsed = [];
for (const el in expElemnts) {
  console.log(expElemnts[el]);
  if (parseInt(expElemnts[el], 10)) numUsed.push(expElemnts[el]);
}

let numbers = expression.match(/\d+/g).map(Number);
console.log(numbers);
//console.log('dsadaв:', cyrillicPattern.test('Привіт'));
// var input = "hello123fdwelcome";
// var fs = require('fs');
// fs.readFile("words.txt", function(words) {
//    var words = words.toString().split('\n').filter(function(word) {
//        return word.length >= 4;
//    });
//    var output = [];
//    words.forEach(word) {
//        if (input.match(word)) {
//            output.push(word);
//        }
//    });
//    console.log(output);
// });


