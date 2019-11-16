// eslint-disable-next-line strict
let a = [0];
const b = [1, 2];
a = [...b];
b.push(3);
console.log({ a, b });
