import * as r from 'ramda';
import { ValueStack, ProgramList, Word } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull, toNumOrNull } from './words/core';
import { parser } from './parser/Pinna';
import { preProcessDefs } from './preProcessDefs';

const debugLevel = (ics: string[], logLevel: number) => (ics.length <= logLevel);
// user debug sessions do not need to see the housekeeping words (e.g. popInternalCallStack) 
const debugCleanPL = (pl: ProgramList) => r.filter((w) => (w !== "popInternalCallStack"), pl);
const startsWith = (s: string, patt: string) => s.indexOf(patt) === 0;
const isCap = (s: string) => s.search(/[A-Z]/) === 0;

const typeStr = (w: Word) => {
  if (r.is(String, w) 
  && !startsWith(w as string, "number_t") 
  && !startsWith(w as string, "boolean_t") 
  && !startsWith(w as string, "any_t")
  && !isCap(w as string)) {
    return "string_t";
  }
  if (r.is(Number, w)) {
    return "number_t";
  }
  if (r.is(Boolean, w)) {
    return "boolean_t";
  }
  console.log("typeStr ?? ", w)
  return w;
};

const checkForType = (s:ValueStack, ts: string): string => {
  const top = s.pop();
  if (top === undefined) {
    return "none";
  }
  if (top !== ts){ 
    return "mismatch number_t was expected!";
  }
  return "match";
};

export function typeCheck(
  pl: ProgramList,
  wd: WordDictionary,
  level: number
) {
  let s: ValueStack = [];
  let w: Word;
  let concreteTypes: {[index: string]: Word} = {};
  let errorMsg = "";
  while ((w = pl.shift()) !== undefined) {
    let wds: WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      if (typeof wds.typeCompose === 'function') {
        console.log("compose types0 ", w, s, pl);
        [s, pl = pl] = wds.typeCompose(s, pl);
      }
      else if (wds.typeCompose === 'compose' && typeof wds.compose === 'function') {
        console.log("compose types1 ", w, s, pl);
        [s, pl = pl] = wds.compose(s, pl);
      }
      else {
        const plist = toPLOrNull(wds.compose);
        if (plist) {
          pl.unshift(...plist);
        }
      }
    }
    else if (w !== undefined && s !== null) {
      if (r.is(String, w) && startsWith(w as string, '-any_t')) {
        let attachTo: string = w as string;
        attachTo = attachTo.substr(-1, 1);
        if (isCap(attachTo)) {
          console.log("attach concrete type to ", attachTo, w, s, pl);
          concreteTypes[attachTo] = s.pop();
        }
        else {
          s.pop();
        }
      }
      else if (r.is(String, w) && startsWith(w as string, '-number_t')) {
        const match = checkForType(s, "number_t");
        console.log("-number_t ->", match);
        if (match === "none" && level !== 0) {
          s.push("-number_t");
          return s;
        }
      }
      else if (r.is(String, w) && startsWith(w as string, '-string_t')) {
        const match = checkForType(s, "string_t");
        console.log("-string_t ->", match);
        if (match === "none" && level !== 0) {
          s.push("-string_t");
          return s;
        }
      }
      else if (r.is(String, w) && startsWith(w as string, '-boolean_t')) {
        const match = checkForType(s, "boolean_t");
        console.log("-boolean_t ->", match);
        if (match === "none" && level !== 0) {
          s.push("-boolean_t");
          return s;
        }
      }
      else if (r.is(String, w) && isCap(w as string)) {
        console.log("time to substitute in ", concreteTypes[w as string], " for ", w);
        console.log("s and pl: ",s , pl);
        s.push(concreteTypes[w as string]);
      }
      else if (r.is(Array, w)) {
        // s.push([].concat(w));
        console.log("recursive call for array ->", w);
        s.push(typeCheck([].concat(w), wd, level+1)); // copy of type checked 'w'
      }
      else {
        s.push(typeStr(w));
      }
    }
  }
  if (pl.length > 0) {
    return [s, pl];
  }
  else {
    return s;
  }
}


// a slow purr (due to run-time type-checking)
export function* interpreter(
  pl_in: ProgramList | string,
  opt: { logLevel: number, yieldOnId: boolean, maxCycles?: number, wd?: WordDictionary } =
    { logLevel: 0, yieldOnId: false }
) : {} {
  // preProcess if needed 
  const wd_in = opt.wd ? opt.wd : coreWords;
  let internalCallStack = [];
  let [pl, wd] = r.is(Array, pl_in) ? [toPLOrNull(pl_in), wd_in] : preProcessDefs(r.is(String, pl_in) ? parser(pl_in.toString()) : pl_in, wd_in);

  // type check ahead
  // console.log("preCheckTypes(pl, wd)", preCheckTypes(pl, wd));

  let s: ValueStack = [];
  opt?.logLevel ? yield { stack: s, prog: pl, active: true } : null;
  let w;
  const maxCycles = opt.maxCycles || 1000000;
  let cycles = 0;
  while (cycles < maxCycles && internalCallStack.length < 1000 
    && (w = pl.shift()) !== undefined 
    && !(s?.length === 1 && s[0] === null)) {
    cycles += 1;
    let wds: WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      opt.logLevel && !opt.yieldOnId ? debugLevel(internalCallStack, opt.logLevel) ? yield { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: [...internalCallStack] } : null : null;
      if (typeof wds.compose === 'function') {
        let s_ret: ValueStack | null = null;
        [s, pl = pl] = wds.compose(s, pl);
        // if(r.isNil(s_ret)) {
        //   cycles = maxCycles;
        // }
        // else {
        //   s = s_ret;
        // }
      }
      else {
        if (w === "popInternalCallStack") {
          internalCallStack.pop();
        }
        else {
          let plist = toPLOrNull(wds.compose);
          if (plist) {
            internalCallStack.push(toStringOrNull(w));
            pl = [...plist, "popInternalCallStack", ...pl];
          }
        }
      }
    }
    else if (w !== undefined) {
      if (r.is(Array, w)) {
        s?.push([].concat(w));
      }
      else {
        s?.push(w);
      }
      opt.logLevel && opt.yieldOnId ? (debugLevel(internalCallStack, opt.logLevel)) ? yield { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: [...internalCallStack] } : null : null;
    }
  }
  if (s?.length === 1 && s[0] === null) {
    console.log("s has null");
    yield { stack: [], prog: pl, active: false, internalCallStack: [...internalCallStack], error: "a word did not find required data on the stack" };
  }
  if (cycles >= maxCycles) {
    yield { stack: s, prog: pl, active: false, internalCallStack: [...internalCallStack], error: "maxCycles size exceeded: this may be an infinite loop" };
  }
  if (internalCallStack.length >= 1000) {
    yield { stack: s, prog: pl, active: false, internalCallStack: [...internalCallStack], error: "callStack size exceeded: this may be an infinite loop" };
  }
  yield { stack: s, prog: pl, active: false };
}

// (more closer to a) production version interpreter
// Assumes that you have run and tested the interpreter with parsed pre processed input 
// opt:{ logLevel: 0, yieldOnId: false, preProcessed: true, wd: coreWords_merged_with_preProcessedDefs }
//
export function* purr(
  pl: ProgramList,
  wd: WordDictionary,
  cycleLimit: number = 1000000
) {
  let s: ValueStack = [];
  let w;
  let cycles = 0;
  while ((w = pl.shift()) !== undefined && cycles < cycleLimit) {
    cycles += 1;
    let wds: WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      if (typeof wds.compose === 'function') {
        [s, pl = pl] = wds.compose(s, pl);
      }
      else {
        const plist = toPLOrNull(wds.compose);
        if (plist) {
          pl.unshift(...plist);
        }
      }
    }
    else if (w !== undefined && s !== null) {
      if (r.is(Array, w)) {
        s.push([].concat(w));
      }
      else {
        s.push(w);
      }
    }
  }
  if (pl.length > 0) {
    yield { stack: [] as ValueStack, prog: [...s, w, ...pl], active: false, cyclesConsumed: cycles };
  }
  else {
    yield { stack: s, prog: pl, active: false };
  }
}
