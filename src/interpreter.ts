import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull, toNumOrNull } from './words/core';
import { parser as pinna } from './parser/Pinna';
import { preProcessDefs } from './preProcessDefs';
import { check, 
  //    infer, match, 
parse as fbpTypeParse, 
//    print, types 
} from "fbp-types";


const toTypeOrNull = <T extends unknown>(val: any, type: string) => {
    const t = fbpTypeParse(type);
    // console.log('*** t ***', t);
    // console.log('*** check(t, val) ***', check(t, val));
    if (check(t, val)) {
        if ( type === 'string') {
            return toStringOrNull(val);
        }
        if ( type === '(int | float)') {
            return toNumOrNull(val);
        }
    } 
    return null;
}

const parse = pinna;

// purr
export function* interpreter(
  pl_in: ProgramList | string,
  opt: { debug: boolean, yieldOnId: boolean, maxCycles?: number, wd?: WordDictionary } =
    { debug: false, yieldOnId: false }
) {
  // preProcess if needed 
  const wd_in = opt.wd? opt.wd: coreWords;
  let [pl, wd] = r.is(Array, pl_in)? [toPLOrNull(pl_in), wd_in]: preProcessDefs(r.is(String, pl_in)? parse(pl_in.toString()): pl_in, wd_in);
  let s: ValueStack = [];
  opt?.debug ? yield {stack:s, prog:pl, active:true} : null;
  let w;
  const maxCycles = opt.maxCycles || 1000000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds: WordDictionary | WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      opt.debug && !opt.yieldOnId ? yield {stack:s, prog:[w].concat(pl), active:true} : null;
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
      opt.debug && opt.yieldOnId ? yield {stack:s, prog:pl, active:true} : null;
    }
  }
  if (cycles >= maxCycles) {
    yield {stack:s, prog:pl, active:false, error: "maxCycles exceeded: this may be an infinite loop"};
  }
  yield {stack:s, prog:pl, active:false};
}

// (more closer to a) production version interpreter
// Assumes that you have run and tested the interpreter with parsed pre processed input 
// opt:{ debug: false, yieldOnId: false, preProcessed: true, wd: coreWords_merged_with_preProcessedDefs }
//
export function* purr(
  pl: ProgramList,
  wd: WordDictionary
) {
  let s: ValueStack = [];
  let w;
  const maxCycles = 1000000000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds: WordDictionary | WordValue = r.is(String, w) ? wd[w as string] : null;
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
  if (cycles >= maxCycles) {
    yield {stack:s, prog:pl, active:false, error: "maxCycles exceeded: this may be an infinite loop"};
  }
  yield {stack:s, prog:pl, active:false};
}
