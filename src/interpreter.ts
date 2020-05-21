import * as r from 'ramda';
import { ValueStack, ProgramList } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull, toNumOrNull } from './words/core';
import { parser as pinna, unParser as unPinna } from './parser/Pinna';
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

export const parse = pinna;
export const unParse = unPinna;


// purr
export function* interpreter(
  pl_in: ProgramList,
  wd_in: WordDictionary = coreWords,
  opt: { debug: boolean, yieldOnId: boolean, maxCycles?: number } =
    { debug: false, yieldOnId: false }
) {
  let [pl, user_def_wd] = preProcessDefs(pl_in);
  let wd = r.mergeRight(wd_in, user_def_wd);
  let s: ValueStack = [];
  opt?.debug ? yield {stack:s, prog:pl, active:true, dictionary:user_def_wd} : null;
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
    yield [{stack:s, prog:pl, active:false}, "maxCycles exceeded: this may be an infinite loop "];
  }
  yield {stack:s, prog:pl, active:false};
}
