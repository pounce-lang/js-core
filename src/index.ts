// purr is the core interpreter for Pounce, thanks EL for naming that.
import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull } from './words/core';
import { parser as pinna, unParser as unPinna } from './parser/Pinna';

export const parse = pinna;
export const unParse = unPinna;

// insizer
const preProcessDefs = (pl: ProgramList): [ProgramList, WordDictionary] => {
  const defineWord = (wd: WordDictionary, key: string, val: WordValue): WordDictionary => {
    let new_word: WordDictionary = {};
    new_word[key] = val;
    // ToDo: implement a safe mode that would throw a preProcesser error if key is already defined.
    return r.mergeRight(wd, new_word);
  };
  // non-FP section (candidate for refactor)
  let next_pl = [...pl]
  let next_wd = {};
  let def_i = r.findIndex(word => word === 'def', next_pl);
  while (def_i !== -1) {
    if (def_i >= 2) {
      const word = toPLOrNull(next_pl[def_i - 2]);
      const key = toStringOrNull(r.head(toArrOrNull(next_pl[def_i - 1])));
      next_pl.splice(def_i - 2, 3); // splice is particularly mutant
      next_wd = defineWord(next_wd, key, { "def":word} );
    }
    def_i = r.findIndex(word => word === 'def', next_pl);
  }
  return [next_pl, next_wd];
};

export function* purr(
  pl_in: ProgramList,
  wd_in: WordDictionary = coreWords,
  opt: { debug: boolean, yieldOnId: boolean, maxCycles?: number } =
    { debug: false, yieldOnId: false }
) {
  let [pl, user_def_wd] = preProcessDefs(pl_in);
  let wd = r.mergeRight(wd_in, user_def_wd);
  let s: ValueStack = [];
  opt?.debug ? yield [s, pl, true, user_def_wd] : null;
  let w;
  const maxCycles = opt.maxCycles || 1000000;
  let cycles = 0;
  while (cycles < maxCycles && (w = pl.shift()) !== undefined) {
    cycles += 1;
    let wds = r.is(String, w) ? wd[w as string] : null;
    if (wds) {
      opt.debug && !opt.yieldOnId ? yield [s, [w].concat(pl), true] : null;
      if (typeof wds.def === 'function') {
        [s, pl = pl, wd = wd] = wds.def(s, pl, wd);
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
      opt.debug && opt.yieldOnId ? yield [s, pl, true] : null;
    }
  }
  if (cycles >= maxCycles) {
    yield [[s, pl, false], "maxCycles exceeded: this may be an infinite loop "];
  }
  yield [s, pl, false];
}
