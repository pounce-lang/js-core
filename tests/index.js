const r = require('ramda');
const parse = require('../dist/index').parse;
const interpreter = require('../dist/index').interpreter;
const preProcessDefs = require('../dist/index').preProcessDefines;
const purr = require('../dist/index').purr;
const coreWords = require('../dist/index').coreWordDictionary;


const runDebug = (p, debugLevel = 10) => {
  const test2 = interpreter(p, { logLevel: debugLevel });
  result2 = test2.next();
  console.error(result2.value);
  while (result2.value && result2.value.active) {
    result2 = test2.next();
    console.error(result2.value);
  }
  return result2.value.stack;
};

const testIt = (p, expected_result) => {
  let pp;
  try {
    pp = parse(p);
  }
  catch (e) {
    console.error("parse error:", p);
    return false;
  }
  // console.log("parser result:", pp);
  if (!pp) {
    console.error("no parse result:", p);
    return false;
  }
  const test = interpreter(p);
  result = test.next();
  while (result.value && result.value.active) {
    result = test.next();
  }
  const str_exp = JSON.stringify(expected_result);
  const str_res = JSON.stringify(result.value ? result.value.stack : "error");
  if (str_exp === str_res) {
    return true;
  }
  console.error("failed test for:", p);
  console.error("Expected result", str_exp);
  console.error("Erroneously got", str_res);
  console.error("Re running in debug mode:");
  const result2 = runDebug(p, 2);
  console.error(result2 ? result2 : "error", "!=", expected_result);

  return false;
};

let allPassing = 1;
allPassing &= testIt("Hello Pounce", ["Hello", "Pounce"]);
allPassing &= testIt("4 dup drop", [4]);
allPassing &= testIt("[5 8] dup drop pop swap pop swap drop swap +", [13]);
allPassing &= testIt("3 2 7 [+] dip -", [-2]);
allPassing &= testIt("3 2 7 rotate", [7, 2, 3]);
allPassing &= testIt('A B C rollup', ['C', 'A', 'B']);
allPassing &= testIt('A B C rolldown', ['B', 'C', 'A']);
allPassing &= testIt("true [5] [7] if-else", [5]);
allPassing &= testIt("false [5] [7] if-else", [7]);
allPassing &= testIt("false [5] [7 3 [+] apply] if-else", [10]);
allPassing &= testIt("2 1 [>] [5] [7] ifte", [5]);
allPassing &= testIt("2 1 [=] [5] [7] ifte", [2, 7]);
allPassing &= testIt("0 0 [=] [5] [7] ifte", [0, 5]);
allPassing &= testIt("2 1 [==] [5] [7] ifte", [7]);
allPassing &= testIt("2 1[<] [5] [7 3 [+] apply] ifte", [10]);
allPassing &= testIt("0 1 [dup] dip dup [swap] dip +", [0, 1, 1]);
allPassing &= testIt("0 1 dup2 +", [0, 1, 1]);
allPassing &= testIt("0 1 [dup2 +] 5 times", [0, 1, 1, 2, 3, 5, 8]);

// ToDo work on apply-with and def-local-with
// [a b c] [a a * b b + + c -] apply-with 
// [a b c] add-local [pop swap [[] cons def-local]] map dip2 [a a * b b + + c -] apply drop-local
// allPassing &= testIt("3 4 17 [a b c] [a a * b b + + c -] apply-with", [0]);
// [[[a b c] [a a * b b + + c -]] apply-with 
// allPassing &= testIt("3 4 17 [a b c] [a a * b b + + c -] apply-with", [0]);

// def tests
allPassing &= testIt("[1 +] [add-one] def 22 add-one", [23]);
allPassing &= testIt("[dup2 +] [fib] def 0 1 [fib] 5 times", [0, 1, 1, 2, 3, 5, 8]);

//# [dup 1 - dup 0 > [[*] dip fac] [drop drop] ifte] [fac] def 5 [1 swap] apply fac
allPassing &= testIt("[dup 1 - dup 0 > [[*] dip fac] [drop drop] if-else] [fac] def 5 [1 swap] apply fac", [120]);
allPassing &= testIt("5 [1 swap] [dup 1 -] [dup 0 >] [[*] dip] [drop drop] constrec", [120]);
allPassing &= testIt("5 [0 =] [1 +] [dup 1 -] [*] linrec", [120]);

allPassing &= testIt("A [B] cons", [['A', 'B']]);
allPassing &= testIt("[A B] uncons", ['A', ['B']]);
allPassing &= testIt("[1 2] uncons cons", [[1,2]]);

allPassing &= testIt("[A] B push", [['A', 'B']]);
allPassing &= testIt("[A B] pop", [['A'], 'B']);
allPassing &= testIt("[1 2] pop push", [[1,2]]);
allPassing &= testIt("[1 2] pop swap cons", [[2,1]]);

allPassing &= testIt("[1 2] size", [[1, 2], 2]);

allPassing &= testIt("[1 2] [3] concat", [[1, 2, 3]]);

allPassing &= testIt("6 [3 8 5 7 10 2 9 1] [>] split", [[3,5,2,1, 6], [8,7,10,9]]);
allPassing &= testIt("5 [3 6 8 7 10 5 2 9 1] [>] split", [ [ 3, 2, 1, 5 ], [ 6, 8, 7, 10, 5, 9 ] ] );

allPassing &= testIt("[3 8 5 7 10 2 9 1] [2 % 0 ==] map", [[false, true, false, false, true, true, false, false]]);
allPassing &= testIt("[3 8 5 7 10 2 9 1] [2 *] map", [[6, 16, 10, 14, 20, 4, 18, 2]]);
allPassing &= testIt("3 2 1 [1 2 3] [+] map", [[2, 4, 6]]);

allPassing &= testIt(`
[5 6 3 8 4 5 7 2 9 1] 
[size 1 <=] [] [uncons [>] split] [concat] binrec
`, [[1,2,3,4,5,5,6,7,8,9]]);

allPassing &= testIt("1 2 3 4 [a b c x] [a x x * * b x * c + +] apply-with", [27]);
allPassing &= testIt("2 3 4 [slope y-intercept x] [slope x * y-intercept +] apply-with", [11]);

allPassing &= testIt(`
210 2 [] 
[[p n fs] [p n fs p 1 <=] apply-with]
[[p n fs] [fs] apply-with]
[[p n fs] [p n % 0 == [p n / n n fs cons] [p n 1 + fs] if-else] apply-with]
[] linrec
`, [[7,5,3,2]]);
allPassing &= testIt(`
3599 
[2 []] 
[[p n fs] [p n fs p 1 <=] apply-with]
[[p n fs] [fs] apply-with]
[[p n fs] [p n % 0 == [p n / n n fs cons] [p n 1 + fs] if-else] apply-with]
[] linrec5
`, [[61, 59]]);


// set up a production configuration and test purr
const program1 = "0 increment increment decrement [1 +] [increment] def [1 -] [decrement] def";
const parsedProgram1 = parse(program1);
const [preProcessedProgram1, corePlusUserDefinedWords1] = preProcessDefs(parsedProgram1, coreWords);
const runner1 = purr(preProcessedProgram1, corePlusUserDefinedWords1);
const result1 = runner1.next();
allPassing &= (result1.value.active === false && result1.value.stack[0] === 1);

console.log("Pounce Tests Pass:", allPassing === 1);

// runDebug(`
// [6 3 8 4 5 7 2 9 1] 
// [size 1 <=] [] [uncons [>] split] [concat] binrec
// `, 1);
