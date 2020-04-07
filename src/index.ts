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
  opt: { debug: boolean, maxCycles?: number } = { debug: false }
  ) {
//  let pl = [].concat(programList);
  let s: ValueStack = [];
  yield opt?.debug ? [s, pl] : null;
  let w;
  const maxCycles = opt.maxCycles || 10000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      if (typeof wds === 'function') {
        [s, pl = pl] = wds(s, pl);
      }
      else {
        pl.unshift(...wds);
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
    yield opt?.debug ? [s, pl] : null;
  }
  if (cycles >= maxCycles) {
    yield [[s, pl], "maxCycles exceeded: this may be an infinite loop "];
  }
  yield !opt?.debug ? [s, pl] : null;
}

