'use strict';

const PREFIX = 'prefix';

const o = {
  [`${PREFIX}Field`]: 'field with dynamic property name',
};

let i = 0;
const a = {
  ['foo' + ++i]: i,
  ['foo' + ++i]: i,
  ['foo' + ++i]: i,
};

console.log({ o, a });
