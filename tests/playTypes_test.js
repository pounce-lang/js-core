const r = require('ramda');
const parse = require('../dist/index').parse;
const interpreter = require('../dist/index').interpreter;
const preProcessDefs = require('../dist/index').preProcessDefines;
const purr = require('../dist/index').purr;

const runDebug = (p, logLevel = 10, wd = {}) => {
  const test2 = interpreter(p, { logLevel, wd });
  let result2 = test2.next();
  console.error(result2.value);
  while (result2.value && result2.value.active) {
    result2 = test2.next();
    console.error(result2.value);
  }
  return result2.value.stack;
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
  const itest = interpreter(p, {wd});
  let iresult = itest.next();
  while (iresult.value && iresult.value.active) {
    iresult = itest.next();
  }
  const str_exp = JSON.stringify(expected_result);
  const str_res = JSON.stringify(iresult.value ? iresult.value.stack : "error");
  if (str_exp === str_res) {
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
      const str_exp2 = JSON.stringify(expected_result);
      const str_res2 = JSON.stringify(presult.value ? presult.value.stack : "error");
      if (str_exp2 === str_res2) {
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
  console.error("Re running in debug mode:");
  const result2 = runDebug(p, 2, wd);
  console.error(result2 ? result2 : "error", "!=", expected_result);

  return false;
};

let allPassing = 1;

// test playType dictionaries
const program0 = "t-number t-string swap t-number + ";
const parsedProgram0 = parse(program0);
const typeComposers = {
  'times': {
    compose: (s, pl) => {
      const c = s.pop();
      const phrase = s.pop();
      if (c === 't-number' && phrase) {
        s.push(phrase);
        pl.unshift('play');
      }
      else if (c === 't-number' && !phrase) {
        s.push('-t-phrase');
        pl.unshift('play');
      }
      else if (!c && !phrase) {
        s.push('-t-phrase');
        s.push('-t-number');
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
  "-t-number": {
    compose: (s) => {
      const a = s.pop();
      if (a !== 't-number') {
        s.push('-t-number');
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
    compose: (s) => {
      const a = s.pop();
      const b = s.pop();
      if (a === 't-number' && b === 't-number') {
        s.push(a);
      }
      else if (a === 't-number' && !b) {
        s.push('-t-number');
      }
      else if (!a && !b) {
        s.push('-t-number');
        s.push('-t-number');
      }
      else {
        s.push("type error at '+'");
      }
      return [s];
    },
    // sig: [[], [{ type: 'number' }]],
  }
};
const [preProcessedProgram0, corePlusUserDefinedWords0] = preProcessDefs(parsedProgram0, typeComposers);
const runner0 = interpreter(preProcessedProgram0, { wd: corePlusUserDefinedWords0 });
const result0 = runner0.next();
if (!(result0.value.active === false && result0.value.stack[0] === 't-string' && result0.value.stack[1] === 't-number')) {
  console.log("hmmm", result0.value.stack);
}
allPassing &= (result0.value.active === false && result0.value.stack[0] === 't-string' && result0.value.stack[1] === 't-number');


// set up a production configuration and test purr
const program1 = `t-number increment increment 
[t-number +] [increment] compose `;
const parsedProgram1 = parse(program1);
const [preProcessedProgram1, corePlusUserDefinedWords1] = preProcessDefs(parsedProgram1, typeComposers);
const runner1 = purr(preProcessedProgram1, corePlusUserDefinedWords1);
const result1 = runner1.next();
allPassing &= (result1.value.active === false && result1.value.stack[0] === 't-number');

allPassing &= testIt("t-number t-number +", ['t-number'], typeComposers);
allPassing &= testIt("t-number +", ['-t-number'], typeComposers);
allPassing &= testIt("+", ['-t-number','-t-number'], typeComposers);
allPassing &= testIt("t-number t-string swap t-number +", ['t-string', 't-number'], typeComposers);
allPassing &= testIt("t-number t-number [+] play", ['t-number'], typeComposers);
allPassing &= testIt("t-string t-number t-number [+ swap] play", ['t-number', 't-string'], typeComposers);
allPassing &= testIt('t-number t-number [[[+] play] play] play', ["t-number"], typeComposers);
allPassing &= testIt('t-number [[t-number [+] play] play] play', ["t-number"], typeComposers);
allPassing &= testIt('[t-number [[+] play] play] play', ["-t-number"], typeComposers);
allPassing &= testIt('t-number t-number -t-number', ["t-number"], typeComposers);
allPassing &= testIt('t-number [dup +] t-number times', ["t-number"], typeComposers);
allPassing &= testIt('t-number [dup dup +] t-number times', ["t-number", "t-number"], typeComposers);


console.log("playType Tests Pass:", allPassing === 1);

// runDebug(`
// [3 8 5 7 10 2 9 1] [2 % 0 !=] filter
// `, 1, someWD);
