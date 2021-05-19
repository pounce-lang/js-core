// preProcessDefs (aka: incisor)
import * as r from 'ramda';
import { ProgramList, WordSignature, Word } from './types';
import { WordDictionary, WordValue } from "./WordDictionary.types";
import { toPLOrNull, toStringOrNull, toArrOrNull } from './words/core';
import { unParser as unparse, parser } from './parser/Pinna';

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
type TypeListElement = { type: string, w?: string, guard?: Word[], use?: string };

const justTypes = (ws: WordSignature, w: Word) => {
  const inTypes = r.map((a) => ({ ...a, w: w.toString() }), ws[0]);
  const outTypes = r.map((a) => ({ type: a.type, w: w.toString() }), ws[1]);
  return [inTypes, outTypes];
};

const isGeneric = (t: string): boolean => (t === t.toUpperCase());
const bindSigToType = (sig: TypeListElement[], toType: TypeListElement, genType: TypeListElement) => {
  // console.log(genType, " is bound to ", toType);
  return r.map((ele: TypeListElement) => {
    if (ele.type === genType.type) {
      ele = toType;
    }
    return ele;
  }, sig);
}

// [a b c] false [b == ||] reduce
const matchTypes = (a: string, b: string) => {
  if (a !== b) {
    // console.log(a, "not == to ", b, "<--- maybe work to do?");
  }
  return a === b;
};

export const preCheckTypes = (pl: ProgramList, wd: WordDictionary) => {
  const typelist: TypeListElement[][][] = r.map((w: Word): TypeListElement[][] => {
    // string | number | Word[] | boolean | { [index: string]: Word }
    if (r.is(Boolean, w)) {
      return [[], [{ type: "boolean", w: w.toString() }]];
    }
    if (r.is(Number, w)) {
      const t = "number"; // print(infer (w));
      return [[], [{ type: t, w: w.toString() }]];
    }
    if (r.is(String, w)) {
      //console.log("w", w);
      if (wd[w as string]) {
        //console.log("w2", wd[w as string]);
        return justTypes(wd[w as string].sig, w);
      }
      else {
        return [[], [{ type: "string", w: w.toString() }]];
      }
    }
    if (r.is(Array, w)) {
      const wl = w as Word[];
      const arrayTypesResult = preCheckTypes(wl, wd);
      // console.log("arrayTypesResult", arrayTypesResult);
      // return [[], [{type: `${JSON.stringify(arrayTypesResult)}`, w: w.toString()}]];
      ///if (r.is(Array, arrayTypesResult)) {
      return [[], [{ type: unparse([arrayTypesResult]), w: unparse([w]) }]];
      ///}
      // return [arrayTypesResult as any[]]; //, w: `[${unparse(wl)}]`}]];
    }
    return [[], [{ type: "any", w: w.toString() }]];
  }, pl);

  if (typelist) {
    //console.log("typelist", JSON.stringify(typelist));
    return r.reduce((acc, sig: TypeListElement[][]) => {
      if (r.is(Array, sig) && r.length(sig) === 2) {
        let input = sig[0];
        const inLength = r.length(input);
        if (inLength > 0 && r.length(acc) >= inLength) {
          // check expected input types
          //console.log("acc", JSON.stringify(acc), "input", JSON.stringify(input));
          let topNstack = r.takeLast(inLength, acc);
          let allMatch = true;
          let i = 0;
          while (r.length(topNstack) > 0 && allMatch) {
            // console.log(r.takeLast(1, topNstack)[0].type, r.takeLast(1, input)[0].type);
            if (isGeneric(r.takeLast(1, input)[0].type)) {
              sig[1] = bindSigToType(sig[1], r.takeLast(1, topNstack)[0], r.takeLast(1, input)[0]);
              input = bindSigToType(input, r.takeLast(1, topNstack)[0], r.takeLast(1, input)[0]);
            }
            if (matchTypes(r.takeLast(1, topNstack)[0].type, r.takeLast(1, input)[0].type)) {
              const inputGuard = sig[0][sig[0].length - 1 - i]?.guard;
              if (inputGuard) {
                if (inputGuard[1] === "!=" && r.takeLast(1, topNstack)[0].w.toString() === inputGuard[0].toString()) {
                  return [{ error: `Guard found that the static value ${r.takeLast(1, topNstack)[0].w.toString()} failed to pass its requirement [${unparse(inputGuard)}]` }];
                }
              }
              topNstack = r.dropLast(1, topNstack);
              input = r.dropLast(1, input);
              i += 1;
            }
            else {
              allMatch = false;
            }
          }
          if (allMatch) {
            acc = r.dropLast(inLength, acc);
          }
          else {
            return [{
              error: `An unexpected stack type of ${topNstack[topNstack.length - 1].type} with value '${topNstack[topNstack.length - 1].w}' was encountered by ${input[input.length - 1].w}`,
              word: input[input.length - 1].w, stackDepth: i,
              expectedType: input[input.length - 1].type,
              encounteredType: topNstack[topNstack.length - 1].type,
              encounterdValue: topNstack[topNstack.length - 1].w
            }];
          }
        }
        const output = sig[1];
        if (r.length(output) > 0) {
          //console.log("acc", JSON.stringify(acc), "output", JSON.stringify(output));
          return r.concat(acc, output);
        }


      }
      return null;

    }, [], typelist);
    //return typelist;
  }
  return "not implemented";
};
