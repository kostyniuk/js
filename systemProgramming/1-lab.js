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

const defMode =
  key === 'default' ?
    [
      'for',
      'fir',
      'asd',
      'fore',
      'adsffs',
      'fore',
      'dasvx',
      'poer',
      'for',
      'fore'
    ] :
    examples;
key = 'forest';

const bs = (target, arr, left, right) => {
  const mid = Math.floor((right - left) / 2 + left);
  if (right <= left && arr[mid] !== target) return -1;
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return bs(target, arr, mid + 1, right);
  return bs(target, arr, left, right - 1);
};

const obj = {
  key,
  arr: defMode,
  search(target, array = this.values, left = 0, right = array.length - 1) {
    const sorted = array.sort();
    return bs(target, sorted, left, right);
  },
  create(str) {
    this.values.push(str);
    return obj.values;
  },
  update(str1, str2) {
    const index = this.search(str1);
    this.values[index] = str2;
    return obj.values;
  },
  delete(target) {
    const index = this.search(target);
    this.values.splice(index, 1);
    return obj.values;
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
      substring,
      indexes,
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

console.log(obj.similarity());
