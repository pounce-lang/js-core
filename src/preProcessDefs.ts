// preProcessDefs (aka: incisor)
import * as r from 'ramda';
import { ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { toPLOrNull, toStringOrNull, toArrOrNull } from './words/core';
import { unParser as unparse, parser } from './parser/Pinna';
var verbose = false;
const log = (logging: boolean, ...args: any) => {
  if (logging) {
    console.log(args);
  }
};

export const preProcessDefs = (pl: ProgramList, coreWords: WordDictionary): [ProgramList, WordDictionary] => {
  const defineWord = (wd: WordDictionary, key: string, val: WordValue): WordDictionary => {
    let new_word: WordDictionary = {};
    new_word[key] = val;
    // ToDo: implement a safe mode that would throw a preProcesser error if key is already defined.
    return r.mergeRight(wd, new_word);
  };
  // non-FP section (candidate for refactor)
  let next_pl = [...pl]
  let next_wd = {};
  let def_i = r.findIndex(word => word === 'compose', next_pl);
  while (def_i !== -1) {
    if (def_i >= 2) {
      const word = toPLOrNull(next_pl[def_i - 2]);
      const key = toStringOrNull(r.head(toArrOrNull(next_pl[def_i - 1])));
      next_pl.splice(def_i - 2, 3); // splice is particularly mutant
      next_wd = defineWord(next_wd, key, { "compose": word });
    }
    def_i = r.findIndex(word => word === 'compose', next_pl);
  }
  return [next_pl, r.mergeRight(coreWords, next_wd)];
};

