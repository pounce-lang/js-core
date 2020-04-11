import { ProgramList } from './types';
import { WordDictionary } from "./WordDictionary";
export declare const parse: (input: string, options: any) => any;
export declare const unParse: (pl: any[]) => string;
export declare function purr(pl: ProgramList, wd?: WordDictionary, opt?: {
    debug: boolean;
    yieldOnId: boolean;
    maxCycles?: number;
}): Generator<(boolean | ProgramList)[] | (string | (boolean | ProgramList)[])[], void, unknown>;
