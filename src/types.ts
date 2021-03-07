// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [index: string]: Word };
export type ValueStack = Word[];
export type ProgramList = Word[];
export type Signature = { type: string, guard?: Word[], use?: string }[];
export type WordSignature = Signature[];
