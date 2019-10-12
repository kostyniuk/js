'use strict';

//b=2*a[n]; b=d;
// expression, assignment-operator, expression, unary-operator, expression
// expression assignment_operator, expression;


// <expression> ::= <assignment-expression> | <expression> , <assignment-expression>
// <assignment-expression> ::= <conditional-expression> | <unary-expression> <assignment-operator> <assignment-expression>
//  <assignment-operator> ::= =
// | *=
// | /=
// | %=
// | +=
// | -=
// | <<=
// | >>=
// | &=
// | ^=
// | |=

// <unary-operator> ::= &
// | *
// | +
// | -
// | ~
// | !

const eliminateFloatsFromInts = (arrFl, arrInt) => {

  const flatArrFl = arrFl.flat();
  const flatArrInt = arrInt.flat();

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

const str = 'b = 12.2 *a[n]+ 3.5 + 7 + 6 ; b = 12 + d * 1.2;';

const reserved = ['if', 'then', 'else', 'switch', 'case', 'default', 'break',
  'int', 'float', 'char', 'double', 'long', 'for', 'while', 'do', 'void',
  'goto', 'auto', 'signed', 'const', 'extern', 'register', 'unsigned', 'return',
  'continue', 'Enumerator', 'sizeof', 'struct', 'typedev', 'union', 'volatile'];

let expressions = str.split(';').slice(0, -1);
expressions = expressions.map(el => el.trim());
console.log({ expressions });

const ids = expressions.map(el => el.match(/[A-Za-z_][A-Za-z0-9_]*/g));

const floats = expressions.map(el => el.match(/[0-9]+[.][0-9]+/g)).flat();

let integers = expressions.map(el => el.match(/\d+/g)).flat();
integers = eliminateFloatsFromInts(floats, integers);

const keyWords = getReserved(str, reserved);


console.log(ids);
console.log(integers);
console.log(floats);
console.log(keyWords);

expression[0]