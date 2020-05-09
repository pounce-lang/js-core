import { ValueStack, ProgramList } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare const parse: (input: string, options: any) => any;
export declare const unParse: (pl: any[]) => string;
export declare function interpreter(pl_in: ProgramList, wd_in?: WordDictionary, opt?: {
    debug: boolean;
    yieldOnId: boolean;
    maxCycles?: number;
}): Generator<{
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    dictionary: WordDictionary;
} | {
    stack: ValueStack;
    prog: import("./types").Word[];
    active: boolean;
    dictionary?: undefined;
} | (string | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
})[], void, unknown>;
