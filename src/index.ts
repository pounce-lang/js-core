import { parser as pinna, unParser as unPinna } from './parser/Pinna';
import { interpreter as purr } from './interpreter';
import { coreWords } from './words/core';

// the Pounce language core module exposes these function
export const parse = pinna;
export const unParse = unPinna;
export const interpreter = purr;
export const coreWordDictionary = coreWords;