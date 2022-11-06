import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull } from './words/core';
import { parser } from './parser/Pinna';
import { preProcessDefs } from './preProcessDefs';


// an interpreter that calls purr after parsing and preprocessing, so you dont have to
export function interpreter(
  pl_in: ProgramList | string,
  opt: { logLevel: number, yieldOnId: boolean, maxCycles?: number, wd?: WordDictionary } =
    { logLevel: 0, yieldOnId: false }
) {
  // the word dictionary 
  const wd_in = opt.wd ? opt.wd : coreWords;
  
  // the program list and word dictionary are preProcessed and parsed (if needed) 
  let [pl, wd] = r.is(Array, pl_in) ? [toPLOrNull(pl_in), wd_in] : preProcessDefs(r.is(String, pl_in) ? parser(pl_in.toString()) : pl_in, wd_in);

  // TBD type check ahead
  // console.log("preCheckTypes(pl, wd)", preCheckTypes(pl, wd));

  let s: ValueStack = [];
  const maxCycles = opt.maxCycles || 100000;
  
  return purr(pl, wd, maxCycles);
}

// (more closer to a) production version interpreter
// Assumes that you have run and tested the interpreter with parsed pre processed input 
// opt:{ logLevel: 0, yieldOnId: false, preProcessed: true, wd: coreWords_merged_with_preProcessedDefs }
//
export function* purr(
  pl: ProgramList,
  wd: WordDictionary,
  cycleLimit: number = 10000
) {
  let s: ValueStack = [];
  let cycles = 0;
  while (pl.length > 0) {
    let w = pl.shift();
    let wds: WordValue = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      cycles += 1;
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
    if (cycles >= cycleLimit) {
      cycleLimit = (yield { stack: [] as ValueStack, prog: [...s, w, ...pl], active: true }) ?? 1000;
      cycles = 0;
    }
  }
  return { stack: s, prog: pl, active: false };
}
