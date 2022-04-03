import * as r from 'ramda';
import { ValueStack, ProgramList, Word } from './types';
import { WordValue } from "./WordDictionary.types";
import { coreWords, toPLOrNull, toNumOrNull, toStringOrNull, toBoolOrNull, clone } from './words/core';
import { parser as parse } from './parser/Pinna';

const pop_n = (s: ValueStack, n:number): ValueStack => {
  let out: ValueStack = [];
  while(n--) {
    out.push(s.pop());
  }
  return out;
}

const inplace_replace = (e: string, sb: string, output: ValueStack) => {
  for(let i = 0; i < output.length; i++) {
    if ( output[i] === e) {
      output[i] = sb;
    }
  }
}


const mbr = (s:ValueStack, dt_sig: ProgramList):ValueStack => {
  const dt2 = dt_sig[0] as ProgramList
  const input = dt2[0] as ProgramList;
  let output = dt2[1] as ValueStack;
  const stack_section = pop_n(s, input.length);
  const stack_bind = clone(stack_section);
  console.log("mbr",input, stack_section);
  const bound = r.map(e => {
    const sb = toStringOrNull(stack_bind.pop());
    if (sb !== null && (e === "A" || e === "C" || e === "D" || e === "E" || e === "F")) {
      inplace_replace(e, sb, output);
      return sb;
    }
    else {return e;}
  }
  , input);
  const matches = r.reduce((acc, e) => (acc && (stack_section.pop() === e)), true, bound);
  return matches? output: ["error in match phase of mbr"];
};

export function dtCheck(
  orig_pl: ProgramList,
) {
  let pl = clone(orig_pl);
  let s: ValueStack = [];
  let w: Word;
  let concreteTypes: {[index: string]: Word} = {};
  let errorMsg = "";
  while ((w = pl.shift()) !== undefined) {
    let wds: WordValue = r.is(String, w) ? coreWords[w as string] : null;
    if (wds) {
      s = r.concat(s, mbr(s, toPLOrNull(parse(wds?.dt))));
    }
    else if (w !== undefined && s !== null) {
      if (toNumOrNull(w) !== null) {s.push("N");} 
      else if (toStringOrNull(w) !== null) {s.push("S");} 
      else if (toBoolOrNull(w) !== null) {s.push("B");} 
      else console.log("TBD handle word", w, "on stack",s);
    }
  }
  if (pl.length > 0) {
    return [s, pl];
  }
  else {
    return s;
  }
}
