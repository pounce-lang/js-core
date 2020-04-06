// purr is the core interpreter for Pounce, thanks EL for naming that.
import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary } from "./WordDictionary";
import { coreWords } from './words/core';
import { pinna as parser } from './parser/Pinna';

export const pinna = parser.parse;
export function* purr(programList: ProgramList,
  wd: WordDictionary = coreWords,
  opt: { debug: boolean, maxCycles?: number } = { debug: false }
  ) {
  let pl = [].concat(programList);
  let vstack: ValueStack = [];
  yield opt?.debug ? [vstack, pl] : null;
  let w;
  const maxCycles = opt.maxCycles || 10000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift())) {
    cycles += 1;
    let wds = !r.is(Array, w) ? wd[w as string | number] : null;
    if (wds) {
      if (typeof wds === 'function') {
        [vstack, pl = pl] = wds(vstack, pl);
      }
      else {
        pl.unshift(...wds);
      }
    }
    else if (w || r.is(Array, w)) {
      if (r.is(Array, w)) {
        vstack.push([].concat(w));
      }
      else {
        vstack.push(w);
      }
    }
    yield opt?.debug ? [vstack, pl] : null;
  }
  if (cycles >= maxCycles) {
    yield [[vstack, pl], "maxCycles exceeded: this may be an infinite loop "];
  }
  yield !opt?.debug ? [vstack, pl] : null;
}

