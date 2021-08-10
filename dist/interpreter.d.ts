import { ValueStack, ProgramList, Word } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare function typeCheck(orig_pl: ProgramList, wd: WordDictionary, level?: number): ValueStack;
export declare function interpreter(pl_in: ProgramList | string, opt?: {
    logLevel: number;
    yieldOnId: boolean;
    maxCycles?: number;
    wd?: WordDictionary;
}): {};
export declare function purr(pl: ProgramList, wd: WordDictionary, cycleLimit?: number): Generator<{
    stack: ValueStack;
    prog: Word[];
    active: boolean;
    cyclesConsumed: number;
} | {
    stack: ValueStack;
    prog: ProgramList;
    active: boolean;
    cyclesConsumed?: undefined;
}, void, unknown>;
