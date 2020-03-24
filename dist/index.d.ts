declare type Word = string | number;
declare type ValueStack = Array<Word>;
declare type ProgramList = Array<Word>;
declare type StackFunction = ((s: ValueStack) => ValueStack);
interface WordDictionary {
    [key: string]: ProgramList | StackFunction;
}
export declare function purr(programList: ProgramList, wd: WordDictionary, opt?: {
    debug?: boolean;
}): Generator<string | ValueStack[] | (string | ValueStack[])[], void, unknown>;
export {};
