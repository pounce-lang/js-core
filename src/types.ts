// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [property: string]: Word };
export type ValueStack = Word[];
export type ProgramList = Word[];
export type Signature = { type: string, gaurd?: Word[], use?: string };
export type WordSignature = Signature[];
