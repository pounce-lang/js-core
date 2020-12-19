// Pounce interpreter types

export type Word = string | number | Word[] | boolean | { [index: string]: Word };
export type ValueStack = Word[];
export type ProgramList = Word[];

export type Sig = { type: string | string[], gaurd?: Word[], use?: string };
export type Signature = Sig[];
export type CombinedSig = {in: Signature | null, out: Signature | null};
export type TypeScan = Array<string | CombinedSig | TypeScan>
