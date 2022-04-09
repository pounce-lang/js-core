import * as r from 'ramda';
import { ValueStack, ProgramList, Word } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toNumOrNull, toStringOrNull, toBoolOrNull, toArrOrNull, clone, compareObjects, toArrOfStrOrNull } from './words/core';
import { parser as parse, unParser as unparse } from './parser/Pinna';
import { purr } from './interpreter';

const dtWords: WordDictionary = {
  'comp': {
      sig: [[], []],
      typeCompose: "compose",
      compose: s => {
          const fo = toArrOfStrOrNull(s?.pop());
          const fi = toArrOfStrOrNull(s?.pop());
          let error = false;
          // console.log("comp 1 fi fo", fi, fo);
          if (fo && fi) {
              if(s.length >= fi.length) {
                  while(fi.length > 0) {
                      const last = toStringOrNull(fi.pop());
                      const top = toStringOrNull(s.pop());
                      if (last === null || top === null || last !== top) {
                          s.push("error: comp 1 mismatch s:", top, "with fi:", last)
                          error = true;
                      }
                  }
                  if(!error) {
                      // console.log("comp 102");
                      s.push(...fo);
                  }
                  else {
                      console.log("comp 103");
                      return null;
                  }
              }
              else {
                  while(s.length > 0 && fi.length > 0) {
                      const last = toStringOrNull(fi.pop());
                      const top = toStringOrNull(s.pop());
                      if (last === null || top === null || last !== top) {
                          s.push("error: comp 2 mismatch s:", top, "with fi:", last)
                          error = true;
                      }
                  }
                  if(!error && fi.length > 0) {
                      // console.log("comp 104");
                      s.push(fi, fo, "comp");
                  }
                  else if (!error && fi.length === 0) {
                      console.log("comp 105");
                      s.push(fo);
                  }
                  else {
                      console.error("Type error 26");
                      return null;
                  }
              }
              return [s];
          }
          if(fi === null && fo !== null) {
              // console.log("comp 106", s, fo);
              s.push(...fo);
              return [s];
          }
          console.error("Type error 27" , fi, fo);
          return [null];
      }
  },
  'run': {
      sig: [[], []],
      typeCompose: "compose",
      compose: (s, pl) => {
          const block = toPLOrNull(s?.pop());
          if (block) {
              // console.log("run 202", block, pl);
              pl = block.concat(pl);
          }
          else {
              // console.log("run 203", block, pl);
              pl.unshift(block);
          }
          return [s, pl];
      }
  },
  'bind': {
      sig: [[], []],
      typeCompose: "compose",
      compose: s => {
          let fo = toArrOfStrOrNull(s?.pop());
          const fi = toArrOfStrOrNull(s?.pop());
          let error = false;
          if (fo !== null && fi !== null) {
              while(s.length > 0 && fi.length > 0) {
                  const se = s.pop();
                  const e = fi.pop();
                  if (e === "A" || e === "C" || e === "D" || e === "E" || e === "F") {
                      fo = r.map(foe => foe === e? se: foe, fo) as any[];
                  }
              }
              if (fi.length === 0) {
                  // console.log("bind push 1 s fo", s, fo);
                  s.push(...fo);
              }
              else {
                  // console.log("bind another day push 2 ", fi, fo, "comp");
                  s.push(fi, fo, "bind");
              }

              return [s];
          }
          console.error("Type error 28");
          return [null];
      }
  }
};


const mbr2 = (s: ValueStack, sig: ProgramList): ValueStack => {
  let initial = r.concat(s, r.unnest(sig));
  let typeExp1 = clone(initial);
  let purrur = purr(initial as ProgramList, dtWords);
  let typeExp2 = purrur.next().value.stack;
  let count = 0; // just incase there is a bad recursive type def
  // console.log("mbr 0", typeExp1, typeExp2);
  while (count < 500 && ! compareObjects(typeExp1, typeExp2)) {
    count++;
    // console.log("mbr *", typeExp1, typeExp2);
    initial = clone(typeExp2);
    typeExp1 = clone(typeExp2);
    purrur = purr(initial as ProgramList, dtWords);
    typeExp2 = purrur.next().value.stack;
  }
  return typeExp2;
};

export function dtCheck(
  orig_pl: ProgramList,
) {
  let pl = clone(orig_pl);
  let s: ValueStack = [];
  let w: Word;
  let concreteTypes: { [index: string]: Word } = {};
  let errorMsg = "";
  while ((w = pl.shift()) !== undefined) {
    let wds: WordValue = r.is(String, w) ? coreWords[w as string] : null;
    if (wds) {
      // console.log("dtCheck w", w, "s", clone(s), wds?.dt);
      s.push(...parse(wds?.dt)[0]);
    }
    else if (w !== undefined && s !== null) {
      if (toNumOrNull(w) !== null) { s.push("N"); }
      else if (toStringOrNull(w) !== null) {
        if (w === "comp" || w === "bind" || w === "run") {
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
        s.push(dtCheck(w as ProgramList));
      }
      else {
        console.log("TBD handle word", w, "on stack", s);
      }
    }
  }
  if (pl.length > 0) {
    return mbr2(s, pl);
  }
  else {
    return mbr2(s, []);
  }
}
