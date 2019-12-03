'use strict';

//For a:= 1 to n begin for b:=1 to n do begin a:=m; end; end;
/*

*/
module.exports = (expression, singles, multiples) => {
  const getSinglesSymbols = (expression, singles) => {
    const single = [];
    for (let index = 0; index < expression.length; index++) {
      for (let j = 0; j < singles.length; j++) {
        if (expression[index] === singles[j]) {
          const token = singles[j];
          single.push({ token, index });
        }
      }
    }
    return single;
  };

  let result = [];
  const getMultiples = (str, multiples, j) => {
    for (const token of multiples) {
      if (str.includes(token)) {
        const index = str.indexOf(token);
        result.push({ token, index });
        str = str.replace(token, 'aa');
        j++;
        getMultiples(str, multiples, j);
      }
    }
    return result;
  };
  (getMultiples(expression, multiples, 0));
  const singleOp = getSinglesSymbols(expression, singles);
  function removeDuplicates(arr) {

    const result = [];
    const duplicatesIndices = [];

    // Loop through each item in the original array
    arr.forEach((current, index) => {

      if (duplicatesIndices.includes(index)) return;

      result.push(current);

      // Loop through each other item on array after the current one
      for (let comparisonIndex = index + 1;
        comparisonIndex < arr.length; comparisonIndex++) {

        const comparison = arr[comparisonIndex];
        const currentKeys = Object.keys(current);
        const comparisonKeys = Object.keys(comparison);

        // Check number of keys in objects
        if (currentKeys.length !== comparisonKeys.length) continue;

        // Check key names
        const currentKeysString = currentKeys.sort().join('').toLowerCase();
        const comparisonKeysString = comparisonKeys.sort()
          .join('').toLowerCase();
        if (currentKeysString !== comparisonKeysString) continue;

        // Check values
        let valuesEqual = true;
        for (let i = 0; i < currentKeys.length; i++) {
          const key = currentKeys[i];
          if (current[key] !== comparison[key]) {
            valuesEqual = false;
            break;
          }
        }
        if (valuesEqual) duplicatesIndices.push(comparisonIndex);

      } // end for loop

    }); // end arr.forEach()

    return result;
  }
  result = removeDuplicates(result);

  for (const single of singleOp) {
    for (const multiple of result) {
      if (single.index === multiple.index) {
        singleOp.splice(singleOp.indexOf(single), 2);

      }
    }
  }

  result = [...result, ...singleOp];
  result.sort((a, b) => {
    const keyA = a.index;
    const keyB = b.index;
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  const tokensArr = [];
  for (const record of result) {
    tokensArr.push(record.token);
  }
  return tokensArr;
};
