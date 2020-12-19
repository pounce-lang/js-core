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
        ioSigs.push({ in: [inSig], out: [outSig] });
      }
      else {
        ioSigs.push({ in: [inSig], out: null });
      }
    });
  }
  else {
    outS.forEach((outSig: Sig, i: number) => {
      const inSig = inS[i];
      if (inSig) {
        ioSigs.push({ in: [inSig], out: [outSig] });
      }
      else {
        ioSigs.push({ in: null, out: [outSig] });
      }
    });
  }
  console.log("ioSigs", JSON.stringify(ioSigs));
  return ioSigs;
};

const getGenericMapping = (typeStack: TypeScan, ioSigs: CombinedSig[]): { [key: string]: string | TypeScan | CombinedSig } => {
  let genMappings: { [key: string]: string | TypeScan | CombinedSig } = {};
  console.log("typeStack is", typeStack);

  const acc1 = r.reduce((acc: TypeScan, sig: CombinedSig) => {
    let expects = sig?.in?.[0]?.type;
    if (!expects) {
      return acc;
    }
    let genInType = (expects.length === 1) ? expects : expects;
    let consume = (sig.in?.[0]?.use !== "observe");
    let play = (sig.in?.[0]?.use === "play");
    if (play) {
      acc.pop();
      acc.pop();
      acc.push({in:[{type:"hi"}], out: [{type:"there"}]});
      return acc;
    }
    let foundType = consume ? acc.pop() : acc[acc.length - 1];
    if (genInType && typeof genInType === 'string') {
      genMappings[genInType] = foundType;
    }
    else if (typeof genInType !== 'string') {
      console.log("genInType here", genInType);
      genInType.forEach(git => {
        if (git === "*") {
          genMappings[git] = foundType;
        }
        else if (typeof foundType !== 'string' && Array.isArray(foundType)) {
          console.log("foundType[]: ", foundType);
          
          const a = foundType as [];
          genMappings[git] = a.shift();
        }
      });
    }
    return acc;
  }, typeStack, ioSigs);
  console.log("genMappings", genMappings);
  return genMappings;
};

export const typeChecker = (pl: ProgramList, wd: WordDictionary): TypeScan => {

  const typeStack = r.reduce((acc: TypeScan, w: Word) => {
    const wordInDictionary: WordValue | null = typeof w === "string" ? wd[w] : null;
    if (wordInDictionary) {
      console.log(wordInDictionary.sig);
      const inSig = wordInDictionary.sig.in ?? [];
      const inSignature = r.reverse(inSig);
      const outSignature = r.reverse(wordInDictionary.sig.out);
      let ioSigs: CombinedSig[] = combineSigs(inSignature, outSignature);
      let genMappings: { [key: string]: string | TypeScan | CombinedSig } = getGenericMapping(acc, ioSigs);
      acc = r.reduce((acc: TypeScan, sig: CombinedSig) => {
        const outType = sig.out?.[0]?.type;
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
          const arrTypes: string[] = r.map((i: string): string => {
            if (typeof i === 'string') {
              const MappedType = genMappings[i];
              if (typeof MappedType === 'string') {
                return MappedType;
              }
              else if (Array.isArray(MappedType) && MappedType?.length > 0) {
                const firstMappedType = MappedType[0];
                if (typeof firstMappedType === 'string') {
                  return firstMappedType;
                }
              }
              else if (!Array.isArray(MappedType) && MappedType?.in) {

              }
            }
            return "";
          }, outType);
          acc.push(arrTypes as TypeScan);
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
    else if (Array.isArray(w)) {
      const list = typeChecker(w as ProgramList, wd);
      if (typeof list === 'object') {
        acc.push(list as TypeScan);
      }
    }
    return acc;
  }, [], pl);
  console.log(typeStack);
  return typeStack;
};
