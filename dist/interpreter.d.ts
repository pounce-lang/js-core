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
    internalCallStack: string[];
    error?: undefined;
} | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    internalCallStack: string[];
    error: string;
}, {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
}, unknown>;
export declare function purr(pl: ProgramList, wd: WordDictionary, cycleLimit?: number): Generator<{
    stack: ValueStack;
    prog: import("./types").Word[];
    active: boolean;
}, {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
}, number>;
