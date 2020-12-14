import * as r from 'ramda';
import { CombinedSig, ProgramList, Sig, Signature, Word } from '../types';
import { WordDictionary, WordValue } from "../WordDictionary.types";
import { coreWords, toPLOrNull, toStringOrNull, toArrOrNull, toNumOrNull } from '../words/core';
import {
  check,
  //    infer, match, 
  parse as fbpTypeParse,
  //    print, types 
} from "fbp-types";
// import { parser } from '../parser/Pinna';

enum WordIdType {
  STRING, NUMBER, BOOLEAN, LIST
};

const getWordType = (w: Word): WordIdType => {
  switch (typeof w) {
    case 'string':
      return WordIdType.STRING;
    case 'number':
      return WordIdType.NUMBER;
      case 'boolean':
        return WordIdType.BOOLEAN;
      default:
      return WordIdType.LIST;
  }
};

const combineSigs = (inS: Signature, outS: Signature) => {
  let ioSigs: CombinedSig[] = [];
  if (inS.length >= outS.length) {
    inS.forEach((inSig: Sig, i: number) => {
      const outSig = outS[i];
      if (outSig) {
        ioSigs.push({in: inSig, out: outSig});
      }
      else {
        ioSigs.push({in: inSig, out: null});
      }
    });
  } 
  else {
    outS.forEach((outSig: Sig, i: number) => {
      const inSig = inS[i];
      if (inSig) {
        ioSigs.push({in: inSig, out: outSig});
      }
      else {
        ioSigs.push({in: null, out: outSig});
      }
    });
  } 
  console.log("ioSigs", ioSigs);
  return ioSigs;
};

const getGenericMapping = (typeStack: Array<string>, ioSigs: CombinedSig[]): {[key:string]: string} => {
  let genMappings: {[key:string]: string} = {};
  const acc1 = r.reduce((acc: Array<string>, sig: CombinedSig) => { 
    let expects = sig?.in?.type;
    if (!expects) {
      return acc;
    }
    let genInType = (expects.length === 1)? expects : "";
    let consume = (sig.in?.use !== "observe");
    let foundType = consume? acc.pop(): acc[acc.length - 1];
    if (genInType && typeof genInType === 'string') {
      genMappings[genInType] = foundType; 
    }
    return acc;
  }, typeStack, ioSigs);
  console.log("genMappings", genMappings);
  return genMappings;
};

export const typeChecker = (pl: ProgramList, wd: WordDictionary): Array<string | []> => {

  const typeStack = r.reduce((acc: Array<string>, w: Word) => {
    const wordInDictionary: WordValue | null = typeof w === "string" ? wd[w]: null;
    if (wordInDictionary) {
      console.log(wordInDictionary.sig);
      const inSignature = r.reverse(r.head(wordInDictionary.sig));
      const outSignature = r.reverse(r.head(r.tail(wordInDictionary.sig)));
      let ioSigs: CombinedSig[] = combineSigs(inSignature, outSignature);
      let genMappings: {[key:string]: string} = getGenericMapping( acc, ioSigs);
      acc = r.reduce((acc: Array<string>, sig: CombinedSig) => { 
        const outType = sig.out?.type;
        if (outType && typeof outType === 'string') {
          if (outType.length === 1) {
            console.log("push genMappings[outType]", outType, genMappings[outType]);
            acc.push(genMappings[outType]);
          }
          else {
            console.log("push outType", outType);
            acc.push(outType.toUpperCase());
          }
        }
        else if (outType) { // array of type
          console.log("outType: ", typeof outType, JSON.stringify(outType));
        }
        return acc;
      }, acc, r.reverse(ioSigs));
    }
    else {
      const wt: WordIdType = getWordType(w);
      const wtString = WordIdType[wt];
      acc.push(wtString);
    }
    return acc;
  }, [], pl);
  console.log(typeStack);
  return typeStack;
};
