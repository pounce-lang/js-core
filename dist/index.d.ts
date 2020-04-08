import { ProgramList } from './types';
import { WordDictionary } from "./WordDictionary";
export declare const pinna: (input: string, options: any) => any;
export declare function purr(pl: ProgramList, wd?: WordDictionary, opt?: {
    debug: boolean;
    maxCycles?: number;
}): Generator<(boolean | ProgramList)[] | (string | (boolean | ProgramList)[])[], void, unknown>;
