const coreWords = require('../dist/index').coreWords;
const parse = require('../dist/index').parse;

const purr = require('../dist/index').purr;

const testIt = (p, expected_result, d) => {
  const test = purr(parse(p), d);
  result = test.next();
  while (result.value[2]) {
    result = test.next();
  }
  const str_exp = JSON.stringify(expected_result);
  const str_res = JSON.stringify(result.value[0]);
  if (str_exp === str_res) {
    // console.log(result.value[0], "<-", p);
    return true;
  }
  console.error("failed test for:", p);
  console.error("Expected result", str_exp);
  console.error("Erroneously got", str_res);
  console.error("Re running in debug mode:");
  const test2 = purr(parse(p), d, { debug: true });
  result2 = test2.next();
  console.error(result2.value);
  while (result2.value[2]) {
    result2 = test2.next();
    console.error(result2.value);
  }
  console.error(result2.value[0], "!=", expected_result);
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
allPassing &= testIt("true [5] [7] if-else", [5]);
allPassing &= testIt("false [5] [7] if-else", [7]);
allPassing &= testIt("false [5] [7 3 [+] apply] if-else", [10]);
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


console.log("Pounce Tests Pass:", allPassing === 1);

//ToDo...
// # 5 factorial
// 5 [0 =] [1 +] [dup 1 -] [*] linrec

// # quicksort
// [7 2 9 1 2 6 3 8]
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec


t =  `
[size 1 <=] [t] def
[uncons [>] split] [s] def
[[swap] dip cons concat] [u] def
[[test yes no after] test [yes test yes no after linrec] no if-else after] [linrec] def

[6 3 5] [] [t] [] [s] [u] | binrec
[6 3 5] | [t] [] [s] [u] linrec      [] [t] [] [s] [u] linrec binrec
[6 3 5] | size 1 <= [] [s] if-else [u] apply    [] [t] [] [s] [u] linrec binrec
[6 3 5] 3 1 | <= [] [s] if-else [u] apply  [] [t] [] [s] [u] linrec binrec
[6 3 5] false | [] [s] if-else [u] apply   [] [t] [] [s] [u] linrec binrec
[6 3 5] | uncons [>] split [u] apply       [] [t] [] [s] [u] linrec binrec
6 [3 5] | [>] split [u] apply      [] [t] [] [s] [u] linrec binrec
6 [3 5] [>] | split [u] apply      [] [t] [] [s] [u] linrec binrec
6 [3 5] [] | [u] apply      [] [t] [] [s] [u] linrec binrec
6 [3 5] [] | [swap] dip cons concat      [] [t] [] [s] [u] linrec binrec
[3 5] 6 [] | cons concat      [] [t] [] [s] [u] linrec binrec
[3 5] [6] | concat      [] [t] [] [s] [u] linrec binrec
[3 5 6] | [] [t] [] [s] [u] linrec binrec

`;