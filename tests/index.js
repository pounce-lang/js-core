const parse = require('../dist/index').parse;
const interpreter = require('../dist/index').interpreter;

const runDebug = (p, d) => {
  const test2 = interpreter(parse(p), d, { debug: true });
  result2 = test2.next();
  console.error(result2.value);
  while (result2.value && result2.value.active) {
    result2 = test2.next();
    console.error(result2.value);
  }
  return result2.value.stack;
};

const testIt = (p, expected_result, d) => {
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
  const test = interpreter(pp, d);
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
  const result2 = runDebug(p, d);
  console.error(result2 ? result2 : "error", "!=", expected_result);

  return false;
};

let allPassing = 1;
allPassing &= testIt("Hello Pounce", ["Hello", "Pounce"]);
allPassing &= testIt("a dup concat b c 1 3 concat", ['a',
  'dup', 'concat',
  'cc',
  'DDD',
  'dup',
  ['b9'],
  'cat',
  'c',
  1,
  3,
  'concat'],
  {
    b: { def: ["cc", "d", "cat"] },
    d: { def: ["DDD", "dup", ["b9"]] }
  });
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

allPassing &= testIt("6 [3 8 5 7 10 2 9 1] split<", [[3,5,2,1, 6], [8,7,10,9]]);

allPassing &= testIt(`
[6 3 8 4 5 7 2 9 1] 
[size 1 <=] [] [uncons split<] [concat] binrec
`, [[1,2,3,4,5,6,7,8,9]]);

allPassing &= testIt("1 2 3 4 [a b c x] [a x x * * b x * c + +] apply-with", [27]);
allPassing &= testIt("2 3 4 [slope y-intercept x] [slope x * y-intercept +] apply-with", [11]);


console.log("Pounce Tests Pass:", allPassing === 1);

// runDebug("1 2 3 4 [a b c x] [a x x * * b x * c + +] apply-with");
// runDebug(`[6 3 8 4 5 7 2 9 1 0] [size 1 <=] [] [uncons split<] [concat] binrec`);
//[swap] dip cons concat

//ToDo...
// [[init test recurse lastly] [init apply test [recurse apply loc-rec lastly] if] apply-with] [constrec] def
// # 5 factorial
// 5 [dup] [dup 1 >] [dup 1 -] [dup [*] dip] constrec # <<
//        5 | [dup] apply [dup 1 >] apply [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec ] if [dup [*] dip] apply
//      5 5 | [dup 1 >] apply [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec ] if [dup [*] dip] apply
//      5 5 | dup 0 == [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec ] if [dup [*] dip] apply
// 5 5 true | [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec ] if [dup [*] dip] apply
//      5 5 | dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec [dup [*] dip] apply
//    5 5 4 | [noop] [dup 1 >] [dup 1 -] [dup [*] dip] constrec [dup [*] dip] apply


// # quicksort
// [7 2 9 1 2 6 3 8]
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec


// t =  `
// [size 1 <=] [t] def
// [uncons [>] split] [s] def
// [[swap] dip cons concat] [u] def
// [[test yes no after] test [yes test yes no after constrec] no if-else after] [constrec] def

// [6 3 5] [] [t] [] [s] [u] | binrec
// [6 3 5] | [t] [] [s] [u] constrec      [] [t] [] [s] [u] constrec binrec
// [6 3 5] | size 1 <= [] [s] if-else [u] apply    [] [t] [] [s] [u] constrec binrec
// [6 3 5] 3 1 | <= [] [s] if-else [u] apply  [] [t] [] [s] [u] constrec binrec
// [6 3 5] false | [] [s] if-else [u] apply   [] [t] [] [s] [u] constrec binrec
// [6 3 5] | uncons [>] split [u] apply       [] [t] [] [s] [u] constrec binrec
// 6 [3 5] | [>] split [u] apply      [] [t] [] [s] [u] constrec binrec
// 6 [3 5] [>] | split [u] apply      [] [t] [] [s] [u] constrec binrec
// 6 [3 5] [] | [u] apply      [] [t] [] [s] [u] constrec binrec
// 6 [3 5] [] | [swap] dip cons concat      [] [t] [] [s] [u] constrec binrec
// [3 5] 6 [] | cons concat      [] [t] [] [s] [u] constrec binrec
// [3 5] [6] | concat      [] [t] [] [s] [u] constrec binrec
// [3 5 6] | [] [t] [] [s] [u] constrec binrec

// `;