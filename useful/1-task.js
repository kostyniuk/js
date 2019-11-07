'use strict';

const seq = first => {
  if (typeof first !== 'function') return first;
  const funcs = [first];
  const nextExp = other => {
    if (typeof other === 'function') {
      funcs.push(other);
      return nextExp;
    } else {
      let current = other;
      const reversed = funcs.reverse();
      for (let i = 0; i < reversed.length; i++) {
        current = reversed[i](current);
      }
      return current;
    }
  };
  return nextExp;
};

