// node test run it $ node index.js

const parse = require('../dist/index').parse;
console.log(parse('hello world'));

const pounce = require('../dist/index').pounce;
console.log(pounce(parse('hello world')));

