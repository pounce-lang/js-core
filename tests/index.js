const coreWords = require('../dist/index').coreWords;
const pinna = require('../dist/index').pinna;

const purr = require('../dist/index').purr;

const testIt = (p, expected_result, d) => {
  const test = purr(pinna(p), d);
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
  const test2 = purr(pinna(p), d, { debug: true });
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
allPassing &= testIt("true [5] [7] if-else", [5]);
allPassing &= testIt("false [5] [7] if-else", [7]);
allPassing &= testIt("false [5] [7 3 [+] apply] if-else", [10]);
allPassing &= testIt("0 1 [dup] dip dup [swap] dip +", [0, 1, 1]);
allPassing &= testIt("0 1 dup2 +", [0, 1, 1]);
allPassing &= testIt("0 1 [dup2 +] 5 times", [0, 1, 1, 2, 3, 5, 8]);
console.log("All Passing", allPassing === 1);

// # 5 factorial
// [5, [0, '='], [1, '+'],
// ['dup', 1, '-'], ['*'],
// 'linrec']

// quicksort
// [size 1 <=] []
// [uncons [>] split]
// [[swap] dip cons concat] 
// binrec
