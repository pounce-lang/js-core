const parse = require('../dist/index').parse;
const interpreter = require('../dist/index').interpreter;

const testIt = (p, expected_result, d) => {
  const test = interpreter(parse(p), d);
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
  const test2 = interpreter(parse(p), d, { debug: true });
  result2 = test2.next();
  console.error(result2.value);
  while (result2.value && result2.value.active) {
    result2 = test2.next();
    console.error(result2.value);
  }
  console.error(result2.value ? result2.value.stack : "error", "!=", expected_result);
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
//# initial  increment condition recurse   finally
//# [1 swap] [dup 1 -] [dup 0 >] [[*] dip] [drop drop] linrec
// allPassing &= testIt("5 [1 swap] [dup 1 -] [dup 0 >] [[*] dip] [drop drop] linrec ", [120]);
allPassing &= testIt("5 [1 swap] [dup 1 -] [dup 0 >] [[*] dip] [drop drop] linrec ", [120]);


console.log("Pounce Tests Pass:", allPassing === 1);

//ToDo...
// [[init test recurse lastly] [init apply test [recurse apply loc-rec lastly] if] apply-with] [linrec] def
// # 5 factorial
// 5 [dup] [dup 1 >] [dup 1 -] [dup [*] dip] linrec # <<
//        5 | [dup] apply [dup 1 >] apply [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec ] if [dup [*] dip] apply
//      5 5 | [dup 1 >] apply [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec ] if [dup [*] dip] apply
//      5 5 | dup 0 == [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec ] if [dup [*] dip] apply
// 5 5 true | [dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec ] if [dup [*] dip] apply
//      5 5 | dup 1 - [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec [dup [*] dip] apply
//    5 5 4 | [noop] [dup 1 >] [dup 1 -] [dup [*] dip] linrec [dup [*] dip] apply


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
// [[test yes no after] test [yes test yes no after linrec] no if-else after] [linrec] def

// [6 3 5] [] [t] [] [s] [u] | binrec
// [6 3 5] | [t] [] [s] [u] linrec      [] [t] [] [s] [u] linrec binrec
// [6 3 5] | size 1 <= [] [s] if-else [u] apply    [] [t] [] [s] [u] linrec binrec
// [6 3 5] 3 1 | <= [] [s] if-else [u] apply  [] [t] [] [s] [u] linrec binrec
// [6 3 5] false | [] [s] if-else [u] apply   [] [t] [] [s] [u] linrec binrec
// [6 3 5] | uncons [>] split [u] apply       [] [t] [] [s] [u] linrec binrec
// 6 [3 5] | [>] split [u] apply      [] [t] [] [s] [u] linrec binrec
// 6 [3 5] [>] | split [u] apply      [] [t] [] [s] [u] linrec binrec
// 6 [3 5] [] | [u] apply      [] [t] [] [s] [u] linrec binrec
// 6 [3 5] [] | [swap] dip cons concat      [] [t] [] [s] [u] linrec binrec
// [3 5] 6 [] | cons concat      [] [t] [] [s] [u] linrec binrec
// [3 5] [6] | concat      [] [t] [] [s] [u] linrec binrec
// [3 5 6] | [] [t] [] [s] [u] linrec binrec

// `;