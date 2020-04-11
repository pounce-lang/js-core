// purr is the core interpreter for Pounce, thanks EL for naming that.
import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary } from "./WordDictionary";
import { coreWords } from './words/core';
import { pinna as parser } from './parser/Pinna';

export const pinna = parser.parse;
export function* purr(
  pl: ProgramList,
  wd: WordDictionary = coreWords,
  opt: { debug: boolean, yieldOnId: boolean, maxCycles?: number } = 
  { debug: false, yieldOnId: false }
  ) {
  let s: ValueStack = [];
  opt?.debug ? yield [s, pl, true] : null;
  let w;
  const maxCycles = opt.maxCycles || 10000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      opt.debug && !opt.yieldOnId ? yield [s, [w].concat(pl), true] : null;
      if (typeof wds.def === 'function') {
        [s, pl = pl] = wds.def(s, pl);
      }
      else {
        pl.unshift(...wds.def);
      }
    }
    else if (w !== undefined) {
      if (r.is(Array, w)) {
        s.push([].concat(w));
      }
      else {
        s.push(w);
      }
      opt.debug && opt.yieldOnId ? yield [s, pl, true] : null;
    }
    
  }
  if (cycles >= maxCycles) {
    yield [[s, pl, false], "maxCycles exceeded: this may be an infinite loop "];
  }
  yield [s, pl, false];
}

