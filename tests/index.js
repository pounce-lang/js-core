// node test run it $ node index.js
// const r = require('ramda');

const coreWords = require('../dist/index').coreWords;
const pinna = require('../dist/index').parser;
//console.log(pinna);
console.log(pinna.parse('hello world'));

const purr = require('../dist/index').purr;
// console.log(pounce(['hello', [1, 2, 3], { a: 1, b: 2, c: 3 }], [], [{ hello: "there" }]));


const sequence = purr(pinna.parse("a dup concat b c 1 3 concat"),
  {
    b: ["cc", "d", "cat"],
    d: ["DDD", "dup", "b9"]
  });


let result = sequence.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = sequence.next().value;
}
// should be [ 'aa', 'cc', 'DDD', 'DDDb9', 'c', 4 ]
console.log("---------------")
const test = purr(pinna.parse("4 dup drop"));
result = test.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test.next().value;
}
// should be [ 13 ]
console.log("---------------")
const test2 = purr(pinna.parse("[5 8] dup drop pop swap pop swap drop swap +"));
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 13 ]

// # 5 factorial
// [5, [0, '='], [1, '+'],
// ['dup', 1, '-'], ['*'],
// 'linrec']

// quicksort
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec
