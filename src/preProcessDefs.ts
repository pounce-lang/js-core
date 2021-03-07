// preProcessDefs (aka: incisor)
import * as r from 'ramda';
import { ProgramList, WordSignature, Word } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { toPLOrNull, toStringOrNull, toArrOrNull } from './words/core';
// import { parser as pinna, unParser as unPinna } from './parser/Pinna';

// import {
//   check,
//       infer, match, 
//   parse as fbpTypeParse,
//   //    print, types 
// } from "fbp-types";

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

  const justTypes = (ws: WordSignature) => {
    const i = r.map((a)=>a.type, ws[0]);
    const o = r.map((a)=>a.type, ws[1]);
    return [i, o];
  };

  export const preCheckTypes = (pl: ProgramList, wd: WordDictionary): (string[] | string) => {
    const typelist : string[][][] = r.map((w: Word) : string[][] => {
      // string | number | Word[] | boolean | { [index: string]: Word }
      if (r.is(Boolean, w)) {
        return [[], ["boolean"]];
      }
      if (r.is(Number, w)) {
        return [[], ["number"]];
      }
      if (r.is(String, w)) {
        //console.log("w", w);
        if (wd[w as string]) {
          //console.log("w2", wd[w as string]);
          return justTypes(wd[w as string].sig);
        }
        else {
          return [[], ["string"]];
        }
      }
      if (r.is(Array, w)) {
        return [[], ["any[]"]];
      }
      return [[], ["any"]];
    }, pl);
    if (typelist) {
      //console.log("typelist", JSON.stringify(typelist));
      return r.reduce((acc, sig) => {
        if (r.is(Array, sig) && r.length(sig) === 2) {
          const input = sig[0];
          if (r.length(input) > 0 && r.length(acc) >= r.length(input) ) {
            // check expected input types
            console.log("acc", JSON.stringify(acc), "input", JSON.stringify(input));
            acc = r.remove(r.length(input) * -1, r.length(input), acc);
          }
          const output = sig[1];
          if (r.length(output) > 0) {
            console.log("acc", JSON.stringify(acc), "output", JSON.stringify(output));
            return r.concat(acc, output);
          }

           
        }
        return null;

      }, [], typelist);
      //return typelist;
    }
    return "not implemented";
  };

  // const toTypeOrNull = <T extends unknown>(val: any, type: string) => {
  //   const t = fbpTypeParse(type);
  //   // console.log('*** t ***', t);
  //   // console.log('*** check(t, val) ***', check(t, val));
  //   if (check(t, val)) {
  //     if (type === 'string') {
  //       return toStringOrNull(val);
  //     }
  //     if (type === '(int | float)') {
  //       return toNumOrNull(val);
  //     }
  //   }
  //   return null;
  // }
  