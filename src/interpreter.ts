import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull, toNumOrNull } from './words/core';
import { parser as pinna } from './parser/Pinna';
import { preProcessDefs } from './preProcessDefs';
import {
  check,
  //    infer, match, 
  parse as fbpTypeParse,
  //    print, types 
} from "fbp-types";


const toTypeOrNull = <T extends unknown>(val: any, type: string) => {
  const t = fbpTypeParse(type);
  // console.log('*** t ***', t);
  // console.log('*** check(t, val) ***', check(t, val));
  if (check(t, val)) {
    if (type === 'string') {
      return toStringOrNull(val);
    }
    if (type === '(int | float)') {
      return toNumOrNull(val);
    }
  }
  return null;
}

const parse = pinna;

const debugLevel = (ics: string[], logLevel: number) => (ics.length <= logLevel);
// user debug sessions do not need to see the housekeeping words (e.g. popInternalCallStack) 
const debugCleanPL = (pl: ProgramList) => r.filter((w) => (w !== "popInternalCallStack"), pl);

// purr
export function* interpreter(
  pl_in: ProgramList | string,
  opt: { logLevel: number, yieldOnId: boolean, maxCycles?: number, wd?: WordDictionary } =
    { logLevel: 0, yieldOnId: false }
) {
  // preProcess if needed 
  const wd_in = opt.wd ? opt.wd : coreWords;
  let internalCallStack = [];
  let [pl, wd] = r.is(Array, pl_in) ? [toPLOrNull(pl_in), wd_in] : preProcessDefs(r.is(String, pl_in) ? parse(pl_in.toString()) : pl_in, wd_in);
  let s: ValueStack = [];
  opt?.logLevel ? yield { stack: s, prog: pl, active: true } : null;
  let w;
  const maxCycles = opt.maxCycles || 1000000;
  let cycles = 0;
  while (cycles < maxCycles && internalCallStack.length < 1000 && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds: WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      opt.logLevel && !opt.yieldOnId ? debugLevel(internalCallStack, opt.logLevel) ? yield { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: [...internalCallStack] } : null : null;
      if (typeof wds.def === 'function') {
        [s, pl = pl] = wds.def(s, pl);
      }
      else {
        if (w === "popInternalCallStack") {
          internalCallStack.pop();
        }
        else {
          let plist = toPLOrNull(wds.def);
          if (plist) {
            internalCallStack.push(toStringOrNull(w));
            pl = [...plist, "popInternalCallStack", ...pl];
          }
        }
      }
    }
    else if (w !== undefined) {
      if (r.is(Array, w)) {
        s.push([].concat(w));
      }
      else {
        s.push(w);
      }
      opt.logLevel && opt.yieldOnId ? (debugLevel(internalCallStack, opt.logLevel)) ? yield { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: [...internalCallStack] } : null : null;
    }
  }
  if (cycles >= maxCycles || internalCallStack.length >= 1000) {
    yield { stack: s, prog: pl, active: false, internalCallStack: [...internalCallStack], error: "maxCycles or callStack size exceeded: this may be an infinite loop" };
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
      if (typeof wds.def === 'function') {
        [s, pl = pl] = wds.def(s, pl);
      }
      else {
        const plist = toPLOrNull(wds.def);
        if (plist) {
          pl.unshift(...plist);
        }
      }
    }
    else if (w !== undefined) {
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

export const introspectWords = () => r.keys(coreWords);
export const introspectWord = (wn: string) => JSON.parse(JSON.stringify(r.path([wn], coreWords)));