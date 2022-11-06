import * as r from 'ramda';
import { ValueStack, ProgramList, Word } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toNumOrNull, toStringOrNull, toBoolOrNull, toArrOrNull, clone, compareObjects, toArrOfStrOrNull } from './words/core';
import { parser as parse, unParser as unparse } from './parser/Pinna';
import { purr } from './interpreter';

const dtWords: WordDictionary = {
  'guard': { // guard dependant types
    compose: ["play"]
  },
  '=dt=': {
    compose: parse('[0 outAt] dip 0 outAt [swap] dip == [drop drop] dip')
  },
  'comp': { // compose types
    compose: parse("[true [[size 0 <=] dip swap] [[drop] dip] [[pop swap [==] dip swap] dip &&] [] linrec] dip [Error in composition of type] if-else")
  },
  'run': { // run types
    compose: ["play"]
    // compose: parse('[size 0 <=] [drop] [uncons] [] linrec')
  },
  'bind': { // bind types
    compose: (s, pl) => {
      let fo = toArrOfStrOrNull(s?.pop());
      const fi = toArrOfStrOrNull(s?.pop());
      let error = false;
      if (fo !== null && fi !== null) {
        while (s.length > 0 && fi.length > 0) {
          const se = s.pop();
          const e = fi.pop();
          if (e === "A" || e === "C" || e === "D" || e === "E" || e === "F" || e === "G" || e === "H") {
            fo = r.map(foe => foe === e ? se : foe, fo) as any[];
          }
        }
        if (fi.length === 0) {
          // console.log("bind requeue fo", s, fo);
          pl.unshift(...fo);
        }
        else {
          console.log("bind another day push 2 ", fi, fo, "comp");
          s.push(fi, fo, "bind");
        }

        return [s, pl];
      }
      console.error("Type error 28");
      return [null];
    }
  }
};

const mbr2 = (s: ValueStack, sig: ProgramList): ValueStack => {
  let initial = r.concat(s, sig);
  let typeExp1 = clone(initial);
  const allWords = { ...dtWords, ...coreWords };
  let purrur = purr(initial as ProgramList, allWords);
  let typeExp2 = purrur.next().value.stack;
  let count = 0; // just incase there is a bad recursive type def
  // console.log("mbr ", count, typeExp1, typeExp2);
  while (count < 500 && !compareObjects(typeExp1, typeExp2)) {
    count++;
    // console.log("mbr ", count, typeExp1, typeExp2);
    initial = clone(typeExp2);
    typeExp1 = clone(typeExp2);
    purrur = purr(initial as ProgramList, allWords);
    typeExp2 = purrur.next().value.stack;
  }
  return typeExp2;
};

export function typeConversion(
  orig_pl: ProgramList,
) {
  let pl = clone(orig_pl);
  let s: ValueStack = [];
  let w: Word;
  while ((w = pl.shift()) !== undefined) {
    let wds: WordValue = r.is(String, w) ? coreWords[w as string] : null;
    if (wds) {
      // console.log("TC w", w, "s", clone(s), wds?.dt);
      s.push(...parse(wds?.dt)[0]);
    }
    else if (w !== undefined && s !== null) {
      if (toNumOrNull(w) !== null) { 
        s.push(`N|${toNumOrNull(w)}`); 
      }
      else if (toStringOrNull(w) !== null) {
        if (w === "comp" || w === "bind" || w === "run" || w === "drop" || w === "guard") {
          s.push(w);
        }
        else {
          s.push("S");
        }
      }
      else if (toBoolOrNull(w) !== null) {
        s.push("B");
      }
      else if (toArrOrNull(w) !== null) {
        s.push(typeConversion(w as ProgramList));
      }
      else {
        console.log("TBD handle word", w, "on stack", s);
      }
    }
  }
  return s;
}

export function dtCheck(
  typed_pl: ProgramList,
) {
  return mbr2([], typed_pl);
}

