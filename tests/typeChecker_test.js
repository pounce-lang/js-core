const r = require('ramda');
const parse = require('../dist/index').parse;
const typeCheck = require('../dist/index').typeCheck;
// const interpreter = require('../dist/index').interpreter;
// const preProcessDefs = require('../dist/index').preProcessDefines;
// const purr = require('../dist/index').purr;
const coreWords = require('../dist/index').coreWordDictionary;

const testIt = (p, expected_result) => {
  let pp;
  try {
    pp = parse(p);
  }
  catch (e) {
    console.error("parse error:", p);
    return false;
  }
  if (!pp) {
    console.error("no parse result:", p);
    return false;
  }
  const test_result = typeCheck(pp, coreWords);
  const str_exp = JSON.stringify(expected_result);
  const str_res = JSON.stringify(test_result);
  if (str_exp === str_res) {
    return true;
  }
  console.error("failed test for:", p);
  console.error("Expected result", str_exp);
  console.error("Erroneously got", str_res);
  console.error("Re running in debug mode:");
  return false;
};

let allPassing = 1;
// allPassing &= testIt("Hello Pounce", ["STRING", "STRING"]);
// allPassing &= testIt("4 dup drop", ["NUMBER"]);
// allPassing &= testIt("5 8 dup drop", ["NUMBER", "NUMBER"]);
// allPassing &= testIt("hello 8", ["STRING", "NUMBER"]);
// allPassing &= testIt("hello 8 swap", ["NUMBER", "STRING"]);
// allPassing &= testIt("aa 2 true rotate", ["BOOLEAN", "NUMBER", "STRING"]);
// allPassing &= testIt('A 77 false rollup', ["BOOLEAN", "STRING", "NUMBER"]);
// allPassing &= testIt('A 8 true rolldown', ["NUMBER", "BOOLEAN", "STRING"]);
// allPassing &= testIt("a b =", ["STRING", "BOOLEAN"]);
// allPassing &= testIt("a b ==", ["BOOLEAN"]);
// allPassing &= testIt("0 1 dup2 +", ["NUMBER", "NUMBER", "NUMBER"]);
// allPassing &= testIt("2 5 +", ["NUMBER"]);
// allPassing &= testIt(".1 .2 +", ["NUMBER"]);
// allPassing &= testIt("2 5 -", ["NUMBER"]);
// allPassing &= testIt("1.0 0.9 -", ["NUMBER"]);
// allPassing &= testIt("2 5 *", ["NUMBER"]);
// allPassing &= testIt("2 5 /", ["NUMBER"]);
// allPassing &= testIt("2 5 %", ["NUMBER"]);
// allPassing &= testIt("-2 abs", ["NUMBER"]);
// allPassing &= testIt("0.105 2 round", ["NUMBER"]);
// allPassing &= testIt("A [B] cons", [["STRING", "STRING"]]);

// allPassing &= testIt("[A] B push", [["STRING", "STRING"]]);
allPassing &= testIt("[A B] uncons", ["STRING", ["STRING"]]);
// allPassing &= testIt("[1 2] uncons cons", [["NUMBER", "NUMBER"]]);
// allPassing &= testIt("[A B] pop", [["STRING"], "STRING"]);
// allPassing &= testIt("[1 2] pop push", [["NUMBER", "NUMBER"]]);
// allPassing &= testIt("[1 2] pop swap cons", [["NUMBER", "NUMBER"]]);

//---------------------------------------

//allPassing &= testIt("[5 8] dup drop pop swap pop swap drop swap +", ["NUMBER"]);
// allPassing &= testIt("3 2 7 [+] dip -", [-2]);

// allPassing &= testIt("3 2 7 rotate", [7, 2, 3]);
// allPassing &= testIt('A B C rollup', ['C', 'A', 'B']);
// allPassing &= testIt('A B C rolldown', ['B', 'C', 'A']);

// allPassing &= testIt("true [5] [7] if-else", ["NUMBER"]);
// allPassing &= testIt("false [5] [7] if-else", ["NUMBER"]);
// allPassing &= testIt("false [5] [7 3 [+] play] if-else", ["NUMBER"]);
// allPassing &= testIt("2 1 [>] [5] [7] ifte", ["NUMBER"]);
// allPassing &= testIt("2 1 [=] [5] [7] ifte", ["NUMBER", "NUMBER"]);
// allPassing &= testIt("0 0 [=] [5] [7] ifte", ["NUMBER", "NUMBER"]);
// allPassing &= testIt("2 1 [==] [5] [7] ifte", ["NUMBER"]);
// allPassing &= testIt("b b ==", [true]);
// allPassing &= testIt("2 1[<] [5] [7 3 [+] play] ifte", ["NUMBER"]);
// allPassing &= testIt("0 1 [dup] dip dup [swap] dip +", ["NUMBER", "NUMBER", "NUMBER"]);
// allPassing &= testIt("0 1 [dup2 +] 5 times", ["NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"]);

// // discrete ops
// allPassing &= testIt("false false || ", [false]);
// allPassing &= testIt("false true || ", [true]);
// allPassing &= testIt("true false || ", [true]);
// allPassing &= testIt("true true || ", [true]);
// allPassing &= testIt("false false && ", [false]);
// allPassing &= testIt("false true && ", [false]);
// allPassing &= testIt("true false && ", [false]);
// allPassing &= testIt("true true && ", [true]);
// allPassing &= testIt("false !", [true]);
// allPassing &= testIt("true !", [false]);


// // not valid program tests (should not crash)
// allPassing &= testIt("/", null);
// allPassing &= testIt("2 0 /", null);
// allPassing &= testIt("2  /", null);
// allPassing &= testIt("- 16", null);
// allPassing &= testIt("5 - 16 ", null);
// allPassing &= testIt("3 - 16 /", null);
// allPassing &= testIt("- 16 /", null);

// // compose tests
// allPassing &= testIt("[1 +] [add-one] compose 22 add-one", ["NUMBER"]);
// allPassing &= testIt("[dup2 +] [fib] compose 0 1 [fib] 5 times", ["NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"]);

// //# [dup 1 - dup 0 > [[*] dip fac] [drop drop] ifte] [fac] compose 5 [1 swap] play fac
// allPassing &= testIt("[dup 1 - dup 0 > [[*] dip fac] [drop drop] if-else] [fac] compose 5 [1 swap] play fac", [120]);
// allPassing &= testIt("5 [1 swap] [dup 1 -] [dup 0 >] [[*] dip] [drop drop] constrec", [120]);
// allPassing &= testIt("5 [0 =] [1 +] [dup 1 -] [*] linrec", [120]);


// allPassing &= testIt("[1 2] [3] 4 depth", [[1, 2], [3], 4, 3]);
// allPassing &= testIt("[1 2] [3] 4 stack-copy", [[1, 2], [3], 4, [[1, 2], [3], 4]]);
// allPassing &= testIt("[1 2] size", [[1, 2], 2]);

// allPassing &= testIt("[1 2] [3] concat", [[1, 2, 3]]);

// allPassing &= testIt("6 [3 8 5 7 10 2 9 1] [>] split", [[3, 5, 2, 1, 6], [8, 7, 10, 9]]);
// allPassing &= testIt("5 [3 6 8 7 10 5 2 9 1] [>] split", [[3, 2, 1, 5], [6, 8, 7, 10, 5, 9]]);

// allPassing &= testIt("[3 8 5 7 10 2 9 1] [2 % 0 ==] map", [[false, true, false, false, true, true, false, false]]);
// allPassing &= testIt("[3 8 5 7 10 2 9 1] [2 *] map", [[6, 16, 10, 14, 20, 4, 18, 2]]);
// allPassing &= testIt("3 2 1 [1 2 3] [+] map", [[2, 4, 6]]);

// allPassing &= testIt("[3 8 5 7 10 2 9 1] [2 % 0 !=] filter", [[3, 5, 7, 9, 1]]);
// allPassing &= testIt("[3 8 5 7 10 2 9 1] [3 % 0 ==] filter", [[3, 9]]);
// allPassing &= testIt("[3 8 5 7 10 2 9 1] [7 > ] filter", [[8, 10, 9]]);


// allPassing &= testIt("[3 8 5 4 10 2 9 1] 0 [+] reduce", [42]);
// allPassing &= testIt("[3 8 5 4 10 2 9 1] 0 [2 * +] reduce", [84]);


// allPassing &= testIt(`
// [5 6 3 8 4 5 7 2 9 1] 
// [size 1 <=] [] [uncons [>] split] [concat] binrec
// `, [[1, 2, 3, 4, 5, 5, 6, 7, 8, 9]]);

// allPassing &= testIt("0 0 [a b] [a b +] pounce", [0]);
// allPassing &= testIt("0 [a] [a] pounce", [0]);

// allPassing &= testIt("1 2 3 4 [a b c x] [a x x * * b x * c + +] pounce", [27]);
// allPassing &= testIt("2 3 4 [slope y-intercept x] [slope x * y-intercept +] pounce", [11]);

// allPassing &= testIt(`
// 210 2 [] 
// [[p n fs] [p n fs p 1 <=] pounce]
// [[p n fs] [fs] pounce]
// [[p n fs] [p n % 0 == [p n / n n fs cons] [p n 1 + fs] if-else] pounce]
// [] linrec
// `, [[7, 5, 3, 2]]);
// allPassing &= testIt(`
// 3599 
// [2 []] 
// [[p n fs] [p n fs p 1 <=] pounce]
// [[p n fs] [fs] pounce]
// [[p n fs] [p n % 0 == [p n / n n fs cons] [p n 1 + fs] if-else] pounce]
// [] linrec5
// `, [[61, 59]]);


// // test custom dictionaries
// const program0 = "0 test5 swap";
// const parsedProgram0 = parse(program0);
// const customWords0 = {
//   ...coreWords,
//   "test5": {
//     compose: (s) => {
//       s.push(5);
//       return [s];
//     },
//     // sig: [[], [{ type: 'number' }]],
//   }
// };
// const [preProcessedProgram0, corePlusUserDefinedWords0] = preProcessDefs(parsedProgram0, customWords0); // coreWords);
// const runner0 = interpreter(preProcessedProgram0, { wd: corePlusUserDefinedWords0 });
// const result0 = runner0.next();
// if (!(result0.value.active === false && result0.value.stack[0] === 5)) {
//   console.log("hmmm", result0.value.stack);
// }
// allPassing &= (result0.value.active === false && result0.value.stack[0] === 5);


// // set up a production configuration and test purr
// const program1 = "0 increment increment decrement [1 +] [increment] compose [1 -] [decrement] compose";
// const parsedProgram1 = parse(program1);
// const [preProcessedProgram1, corePlusUserDefinedWords1] = preProcessDefs(parsedProgram1, coreWords);
// const runner1 = purr(preProcessedProgram1, corePlusUserDefinedWords1);
// const result1 = runner1.next();
// allPassing &= (result1.value.active === false && result1.value.stack[0] === 1);

// const program2 = "0 [ 1 +] 10000 times";
// const parsedProgram2 = parse(program2);
// const [preProcessedProgram2, corePlusUserDefinedWords2] = preProcessDefs(parsedProgram2, coreWords);
// const runner2 = purr(preProcessedProgram2, corePlusUserDefinedWords2, 100);
// const result2 = runner2.next();
// allPassing &= (result2.value.active === false && result2.value.stack[0] === undefined && result2.value.cyclesConsumed === 100);
// // ... a pounce program that did not finish should be ready to be continued (without parsing)
// const parsedProgram3 = result2.value.prog;
// const [preProcessedProgram3, corePlusUserDefinedWords3] = preProcessDefs(parsedProgram3, coreWords);
// const runner3 = purr(preProcessedProgram3, corePlusUserDefinedWords3);
// const result3 = runner3.next();
// allPassing &= (result3.value.active === false && result3.value.stack[0] === 10000);

console.log("Pounce TypeChecker Tests:", allPassing === 1);
