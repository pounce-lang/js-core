// node test run it $ node index.js
// const r = require('ramda');

const coreWords = require('../dist/index').coreWords;
const pinna = require('../dist/index').pinna;
//console.log(pinna);
console.log(pinna('hello world'));

const purr = require('../dist/index').purr;
// console.log(pounce(['hello', [1, 2, 3], { a: 1, b: 2, c: 3 }], [], [{ hello: "there" }]));


const sequence = purr(pinna("a dup concat b c 1 3 concat"),
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
const test = purr(pinna("4 dup drop"));
result = test.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test.next().value;
}
// should be [ 13 ]
console.log("---------------")
let test2 = purr(pinna("[5 8] dup drop pop swap pop swap drop swap +"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 13 ]
console.log("---------------")
test2 = purr(pinna("3 2 7 [+] dip -"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ -2 ]
console.log("---------------")
test2 = purr(pinna("true [5] [7] if-else"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 5 ]
console.log("---------------")
test2 = purr(pinna("false [5] [7] if-else"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 7 ]
console.log("---------------")
test2 = purr(pinna("false [5] [7 3 [+] apply] if-else"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 7 ]
console.log("---------------")
test2 = purr(pinna("0 1 [dup] dip dup [swap] dip +"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 7 ]
console.log("---------------")
test2 = purr(pinna("0 1 dup2 +"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 7 ]

console.log("---------------")
test2 = purr(pinna("0 1 [dup2 +] 5 times"), undefined, {debug:true});
result = test2.next().value;
while (result !== undefined) {
  if (result !== null) {console.log(result);}
  result = test2.next().value;
}
// should be [ 7 ]


// # 5 factorial
// [5, [0, '='], [1, '+'],
// ['dup', 1, '-'], ['*'],
// 'linrec']

// quicksort
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec
