import * as r from 'ramda';
import { CombinedSig, ProgramList, Sig, Signature, TypeScan, Word } from '../types';
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

const getGenericMapping = (typeStack: TypeScan, ioSigs: CombinedSig[]): {[key:string]: string | TypeScan[]} => {
  let genMappings: {[key:string]: string | TypeScan[]} = {};
  console.log("typeStack is", typeStack);
  
  const acc1 = r.reduce((acc: TypeScan, sig: CombinedSig) => { 
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
    else {
      console.log("genInType here", genInType);
    }
    return acc;
  }, typeStack, ioSigs);
  console.log("genMappings", genMappings);
  return genMappings;
};

export const typeChecker = (pl: ProgramList, wd: WordDictionary): TypeScan => {

  const typeStack = r.reduce((acc: TypeScan, w: Word) => {
    const wordInDictionary: WordValue | null = typeof w === "string" ? wd[w]: null;
    if (wordInDictionary) {
      console.log(wordInDictionary.sig);
      const inSignature = r.reverse(r.head(wordInDictionary.sig));
      const outSignature = r.reverse(r.head(r.tail(wordInDictionary.sig)));
      let ioSigs: CombinedSig[] = combineSigs(inSignature, outSignature);
      let genMappings: {[key:string]: string | TypeScan[]} = getGenericMapping( acc, ioSigs);
      acc = r.reduce((acc: TypeScan, sig: CombinedSig) => { 
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
    else if (typeof w === 'string' || typeof w === 'number' || typeof w === 'boolean') {
      const wt: WordIdType = getWordType(w);
      const wtString = WordIdType[wt];
      console.log("wtString is:", wtString)
      acc.push(wtString);
    }
    else if (r.is(Array, w)) {
      const list = typeChecker(w as ProgramList, wd);
      if (typeof list === 'object') {
        acc.push(list as TypeScan[]);
      }
    }
    return acc;
  }, [], pl);
  console.log(typeStack);
  return typeStack;
};
