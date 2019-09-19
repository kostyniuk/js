'use strict';

let key = process.argv[2];
const examples = [];
for (let i = 3; i < process.argv.length; i++) {
  examples.push(process.argv[i]);
}

const indexOfExt = (el, arr) => {
  const indexes = [];
  for (let i = 0; i < arr.length; i++) {
    if (el === arr[i]) indexes.push(i);
  }
  return indexes;
};

let values =
  key === 'default' ?
    [
      'for',
      'fir',
      'asd',
      'foreqewqewq',
      'adsffs',
      'forebv',
      'dasvx',
      'poer',
      'for',
      'foreer'
    ] :
    examples;

if (key === 'default') key = 'forty';
else key = process.argv[2];

const bs = (target, arr, left, right) => {
  const mid = Math.floor((right - left) / 2 + left);
  if (right <= left && arr[mid] !== target) return -1;
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return bs(target, arr, mid + 1, right);
  return bs(target, arr, left, right - 1);
};

key = key.toLowerCase();
values = values.map(x => x.toLowerCase());

const hash = {
  key,
  arr: values,
  search(target, array = this.arr, left = 0, right = array.length - 1) {
    const sorted = array.sort();
    console.dir({ sorted });
    return bs(target, sorted, left, right);
  },
  create(str) {
    this.arr.push(str);
    return hash;
  },
  update(str1, str2) {
    const index = this.search(str1);
    this.arr[index] = str2;
    return hash;
  },
  delete(target) {
    const index = this.search(target);
    console.log({ index });
    this.arr.splice(index, 1);
    return hash;
  },
  similarity() {
    const repeats = [...this.arr].map(() => 0);
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < key.length; j++) {
        if (key[j] !== this.arr[i][j]) {
          break;
        }
        repeats[i] = j + 1;
      }
    }
    const max = Math.max(...repeats);
    const indexes = indexOfExt(max, repeats);
    const substring = key.substring(0, max);
    return {
      key,
      values,
      substring,
      indexes,
      max,
      words: (() => {
        const words = [];
        for (let i = 0; i < indexes.length; i++) {
          words.push(this.arr[indexes[i]]);
        }
        return words;
      })()
    };
  }
};

// USAGE

console.log(hash.similarity());
console.dir('---SEARCHING---');
console.dir(hash.search('fore'));
console.dir('---CREATING---');
console.dir(hash.create('forasc'));
console.dir('---UPDATING---');
console.dir(hash.update('asd', 'asd2'));
console.dir('---DELETING---');
console.dir(hash.delete('fir'));
