import { ValueStack, ProgramList } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare function interpreter(pl_in: ProgramList | string, opt?: {
    logLevel: number;
    yieldOnId: boolean;
    maxCycles?: number;
    wd?: WordDictionary;
}): Generator<{
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    internalCallStack?: undefined;
    error?: undefined;
} | {
    stack: ValueStack;
    prog: import("./types").Word[];
    active: boolean;
    internalCallStack: import("./types").Word[];
    error?: undefined;
} | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    internalCallStack: import("./types").Word[];
    error: string;
}, void, unknown>;
export declare function purr(pl: ProgramList, wd: WordDictionary): Generator<{
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
}, void, unknown>;
