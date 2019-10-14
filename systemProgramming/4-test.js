'use strict';

const symbols = ['==', '++', '--', '+', '-', '[', ']', '(', ')'];

const expression = 'b = a + c - 12 + f[32]; b=d';


const getAllSymbols = (expression, arrOfSymbols) => {

  const results = [];
  const originalExp = expression;  
  const getSymbols = (expression, symbols)  => {
    for (let i = 0; i < symbols.length; i++) {
      if (expression.includes(symbols[i])) {
        const token = symbols[i];
        const index = expression.indexOf(token);
        console.log(token, expression);
        results.push({ token, index });
        const length = token.length;
        expression = expression.replace(token, '.'.repeat(length));
        getSymbols(expression, arrOfSymbols);
      }
    }
  };
  getSymbols(expression, arrOfSymbols);
  return results;
};

console.log(getAllSymbols(expression, symbols));
