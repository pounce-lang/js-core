// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [index: string]: Word };
export type WordType = string | WordType[];
export type ValueStack = Word[];
export type TypeStack = (Word | WordType)[];
export type ProgramList = Word[];
export type TypeList = (Word | WordType)[];
export type Signature = { type: string, guard?: Word[], use?: string }[];
export type WordSignature = Signature[];
