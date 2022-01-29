const r = require('ramda');
const parse = require('../dist/index').parse;
const interpreter = require('../dist/index').interpreter;
const preProcessDefs = require('../dist/index').preProcessDefines;
const purr = require('../dist/index').purr;

const runDebug = (p, logLevel = 10, wd = {}) => {
  console.log("debugging", p);
  const test2 = interpreter(p, { logLevel:10, wd });
  // console.log("test2", test2);
  let result2 = test2.next();
  console.log("result2", result2);
  console.error("result2.value", result2.value);
  while (result2.value && result2.value.active) {
    result2 = test2.next();
    console.log("...", result2);
  }
  return result2?.value?.stack;
};
const tryConvert = (in_to_t, in_t) => {
  // console.log("orig type in_t", in_t);
  let t = in_t;
  let to_t = in_to_t;
  if (in_t === "error") {
    t = null;
  }
  const to_t_minus = r.includes('-', to_t ?? "");
  const t_minus = r.includes('-', t ?? "");
  to_t = to_t_minus ? r.replace('-', '', to_t): to_t;
  t = t_minus? r.replace('-', '', t): t;
  const c1 = (t === 'Type_boolean' && to_t === 'Type_number');
  const c2 = (t === 'Type_number' && to_t === 'Type_string');
  const c3 = (t === 'Type_boolean' && to_t === 'Type_string');
  const c4 = r.includes(to_t, t ?? "");
  const c5 = r.includes(t, to_t ?? "");
  // console.log("to_t", to_t);
  // console.log("t", t);
  // console.log("c5", c5);
  if (c1 || c2 || c3 || c4) {
    return to_t_minus ? '-'+to_t : to_t;
  }
  else if (c5) {
    return t_minus ? '-'+t : t;
  }
  return undefined;
};

const equivTypeASTs = (a, b) => {
  // console.log("a ==== b", a, b);
  if (!a || ! b) return false;
  return r.reduce((acc, p) => acc && tryConvert(p[1], p[0]) === p[1], true, r.zip(a, b));
};

const testIt = (p, expected_result, dict) => {
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
  let wd;
  try {
    [pp, wd] = preProcessDefs(pp, dict);
  }
  catch (e) {
    console.error("preProcessDefs error:", p);
    return false;
  }
  if (!wd) {
    console.error("no preProcessDefs result:", p);
    return false;
  }
  const itest = interpreter(p, { wd });
  let iresult = itest.next();
  while (iresult.value && iresult.value.active) {
    iresult = itest.next();
  }
  const str_exp = JSON.stringify(expected_result);
  const str_res = JSON.stringify(iresult.value ? iresult.value.stack : ["error"]);
  // if (str_exp === str_res) {
  if (equivTypeASTs(iresult?.value ? iresult.value.stack : ["error"], expected_result)) {
    try {
      const ptest = purr(pp, wd);
      if (!ptest) {
        console.error("purr null result:", test);
        return false;
      }
      let presult = ptest.next();
      while (presult.value && presult.value.active) {
        presult = ptest.next();
      }
      if (equivTypeASTs(presult?.value?.stack, expected_result)) {
        return true;
      }
    }
    catch (e) {
      console.error("purr error:", e, p);
      return false;
    }
  }

  console.error("failed test for:", p);
  console.error("Expected result", str_exp);
  console.error("Erroneously got", str_res);
  console.error("Re-running in debug mode:");
  const result2 = runDebug(p, 2, wd);
  if (equivTypeASTs(result2, expected_result)) {
    console.log("weird that a debug run passes after the first failed!");
    return true;
  }
  else {
    console.error(result2 ? result2 : "error", "!=", expected_result);
  }
  return false;
};


let allPassing = 1;

// notation for types with guards, constraints
// type integer 
//    any value `Type_integer`
//  by guard
//    non-zero positive `Type_integer|0 >|`
//    non-negative      `Type_integer|0 >=|`
//    even              `Type_integer|2 % 0 =|`
//  by claim
//    ever increasing       `Type_integer(++)`
//    ever decreasing       `Type_integer(--)`
//    ever constant         `Type_integer(==)`
//  combinations
//    decreasing, but ever positive   `Type_integer(--)|0 >|`
//    increasing, but ever negative   `Type_integer(++)|0 <|`
//
// types of lists
//    any list `Type_list`
//  by guard
//    non empty    `Type_list|len 0 >|`
//  by claim
//    ever increasing length   `Type_list(++)`
//  constrain contents
//    only integers            `Type_list<Type_integer>`
//    Union integers, strings  `Type_list<Type_integer Type_string>`


// test playType dictionaries
const program0 = "Type_number Type_string swap Type_number + ";
const parsedProgram0 = parse(program0);
const typeComposers = {
  'times': {
    compose: (s, pl) => {
      const c = s.pop();
      const phrase = s.pop();
      if (c === 'Type_number' && phrase) {
        s.push(phrase);
        pl.unshift('play');
      }
      else if (c === 'Type_number' && !phrase) {
        s.push('-Type_phrase');
        pl.unshift('play');
      }
      else if (!c && !phrase) {
        s.push('-Type_phrase');
        s.push('-Type_number');
      }
      else {
        s.push("type error at 'times'");
      }
      return [s, pl];
    }
  },
  'play': {
    compose: (s, pl) => {
      const block = s.pop();
      if (block) {
        pl = block.concat(pl);
      }
      else {
        pl.unshift(block);
      }
      return [s, pl];
    }
  },
  "-Type_number": {
    compose: (s) => {
      const a = s.pop();
      if (a !== 'Type_number') {
        s.push('-Type_number');
      }
      return [s];
    },
  },
  "-Type_boolean": {
    compose: (s) => {
      const a = s.pop();
      if (a !== 'Type_boolean') {
        s.push('-Type_boolean');
      }
      return [s];
    },
  },
  "-Type_string": {
    compose: (s) => {
      const a = s.pop();
      if (a !== 'Type_string') {
        s.push('-Type_string');
      }
      return [s];
    },
  },
  "-Type_list": {
    compose: (s) => {
      const a = s.pop();
      if (a !== 'Type_list') {
        s.push('-Type_list');
      }
      return [s];
    },
  },
  "dup": {
    compose: (s) => {
      const a = s.pop();
      s.push(a);
      s.push(a);
      return [s];
    },
  },
  "swap": {
    compose: (s) => {
      const a = s.pop();
      const b = s.pop();
      s.push(a);
      s.push(b);
      return [s];
    }
  },
  "+": {
    compose: (s , pl) => {
      const a = tryConvert('Type_number', s.pop());
      const b_pop = s.pop();
      // console.log("b_pop", b_pop);
      const b = tryConvert('Type_number|Type_list', b_pop);
      if (a === 'Type_number' && b === 'Type_number') {
        s.push(a);
      }
      else if (a === 'Type_number' && b === 'Type_list') {
        s.push(b);
      }
      else if (a === 'Type_number' && !b) {
        s.push('-Type_number|-Type_list');
      }
      else if (!a && !b) {
        s.push('-Type_number|-Type_list');
        s.push('-Type_number');
      }
      else {
        s.push("type error at '+'");
      }
      return [s];
    },
    // sig: [[], [{ type: 'number' }]],
  }
};

// // // // const [preProcessedProgram0, corePlusUserDefinedWords0] = preProcessDefs(parsedProgram0, typeComposers);
// // // // const runner0 = interpreter(preProcessedProgram0, { wd: corePlusUserDefinedWords0 });
// // // // const result0 = runner0.next();
// // // // if (!(result0.value.active === false && result0.value.stack[0] === 'Type_string' && result0.value.stack[1] === 'Type_number')) {
// // // //   console.log("hmmm", result0.value.stack);
// // // // }
// // // // allPassing &= (result0.value.active === false && result0.value.stack[0] === 'Type_string' && result0.value.stack[1] === 'Type_number');


allPassing &= testIt(`Type_number increment increment 
[Type_number +] [increment] compose `, ['Type_number'], typeComposers);

allPassing &= testIt("Type_number Type_number +", ['Type_number'], typeComposers);
allPassing &= testIt("Type_number +", ['-Type_number'], typeComposers);
allPassing &= testIt("+", ['-Type_number', '-Type_number'], typeComposers);
allPassing &= testIt("Type_boolean Type_number +", ['Type_number'], typeComposers);
allPassing &= testIt("Type_list Type_number +", ['Type_list'], typeComposers);

allPassing &= testIt("Type_number Type_string swap Type_number +", ['Type_string', 'Type_number'], typeComposers);
allPassing &= testIt("Type_number Type_number [+] play", ['Type_number'], typeComposers);
allPassing &= testIt("Type_string Type_number Type_number [+ swap] play", ['Type_number', 'Type_string'], typeComposers);
allPassing &= testIt('Type_number Type_number [[[+] play] play] play', ["Type_number"], typeComposers);
allPassing &= testIt('Type_number [[Type_number [+] play] play] play', ["Type_number"], typeComposers);
allPassing &= testIt('[Type_number [[+] play] play] play', ["-Type_number"], typeComposers);
allPassing &= testIt('Type_number Type_number -Type_number', ["Type_number"], typeComposers);
allPassing &= testIt('Type_number [dup +] Type_number times', ["Type_number"], typeComposers);
allPassing &= testIt('Type_number [dup dup +] Type_number times', ["Type_number+"], typeComposers);


console.log("playType Tests Pass:", allPassing === 1);

// runDebug(`
// [3 8 5 7 10 2 9 1] [2 % 0 !=] filter
// `, 1, someWD);
