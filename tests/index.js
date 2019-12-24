// node test run it $ node index.js
const r = require('ramda');

const coreWords = require('../dist/index').coreWords;
const parse = require('../dist/index').parse;
console.log(parse('hello world'));

const pounce = require('../dist/index').pounce;
console.log(pounce(['hello', [1, 2, 3], { a: 1, b: 2, c: 3 }], [], [{ hello: "there" }]));

const hasWord = (k) => (o) => r.complement(r.isNil(r.prop(k)(o)));
const thisWord = r.findLast(hasWord('hello'))([{ hello: 12 }]);
console.log('*** thisWord', thisWord);

console.log(pounce(['hello', 'world', 'swap'], [], [{ hello: ["HELLO"] }]));
