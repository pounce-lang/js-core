import { ProgramList } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare const parse: (input: string, options: any) => any;
export declare const unParse: (pl: any[]) => string;
export declare function purr(pl_in: ProgramList, wd_in?: WordDictionary, opt?: {
    debug: boolean;
    yieldOnId: boolean;
    maxCycles?: number;
}): Generator<(boolean | ProgramList | WordDictionary)[] | (string | (boolean | ProgramList)[])[], void, unknown>;
