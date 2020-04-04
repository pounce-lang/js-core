// node test run it $ node index.js
// const r = require('ramda');

const coreWords = require('../dist/index').coreWords;
const pinna = require('../dist/index').parser;
//console.log(pinna);
console.log(pinna.parse('hello world'));

const purr = require('../dist/index').purr;
// console.log(pounce(['hello', [1, 2, 3], { a: 1, b: 2, c: 3 }], [], [{ hello: "there" }]));


const sequence = purr(pinna.parse("a dup cat b c 1 3 cat"),
  {
    b: ["cc", "d", "cat"],
    d: ["DDD", "dup", "b9"],
    dup: s => { s.push(s[s.length - 1]); return s; },
    cat: s => {
      let arg2 = s.pop();
      let arg1 = s.pop();
      if (typeof arg1 === typeof arg2) {
        if (typeof arg1 === "string") {
          s.push(arg1 + arg2);
        }
        else if (typeof arg1 === "number" && typeof arg2 === "number") {
          s.push(arg1 + arg2);
        }
        else {
          throw "the type of arg(s) was not right"
        }
      }
      else {
        throw "the type of args was not the same"
      }
      return s;
    }
  });


let result = sequence.next().value;
while (result) {
  if (result !== null) {console.log(result);}
  result = sequence.next().value;
}
console.log("---------------")
const test = purr(pinna.parse("4 dup drop"));
result = test.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test.next().value;
}
console.log("---------------")
const test2 = purr(pinna.parse("[5 8] dup drop pop"));
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}

// # 5 factorial
// [5, [0, '='], [1, '+'],
// ['dup', 1, '-'], ['*'],
// 'linrec']

// quicksort
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec
