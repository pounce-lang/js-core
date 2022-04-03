import { parser as pinna, unParser as unPinna } from './parser/Pinna';
import { typeCheck, interpreter as interp, purr as purring } from './interpreter';
import { dtCheck } from './dtCheck';
import { coreWords } from './words/core';
import { preProcessDefs } from './preProcessDefs';

// the Pounce language core module exposes these function
export const parse = pinna;
export const unParse = unPinna;
export const interpreter = interp;
export const coreWordDictionary = coreWords;
export const purr = purring;
export const preProcessDefines = preProcessDefs;
export const preProcessCheckTypes = typeCheck;
export const dtcheck = dtCheck;