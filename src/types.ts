// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [index: string]: Word };
export type ValueStack = Word[];
export type ProgramList = Word[];
