// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [property: string]: Word };
export type ValueStack = Word[];
export type ProgramList = Word[];

// export type FnRet =  [Word[], PL | undefined, Dictionary | undefined];
// export type DefFn = function (Word[], PL | undefined, Dictionary[] | undefined): FnRet => void;

