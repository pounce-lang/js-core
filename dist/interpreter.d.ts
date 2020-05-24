import { ValueStack, ProgramList } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare function interpreter(pl_in: ProgramList | string, opt?: {
    debug: boolean;
    yieldOnId: boolean;
    maxCycles?: number;
    wd?: WordDictionary;
}): Generator<{
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    error?: undefined;
} | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    error: string;
}, void, unknown>;
export declare function purr(pl: ProgramList, wd: WordDictionary): Generator<{
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    error: string;
} | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    error?: undefined;
}, void, unknown>;
