import { ProgramList } from './types';
import { WordDictionary } from "./WordDictionary";
export declare const pinna: (input: string, options: any) => any;
export declare function purr(programList: ProgramList, wd?: WordDictionary, opt?: {
    debug: boolean;
    maxCycles?: number;
}): Generator<any[][] | (string | any[][])[], void, unknown>;
