declare type Word = string | number;
declare type ValueStack = Array<Word>;
declare type ProgramList = Array<Word>;
interface WordDictionary {
    [key: string]: ProgramList | ((s: ValueStack) => ValueStack);
}
export declare function purr(programList: ProgramList, wd: WordDictionary): Generator<string | Word[], void, unknown>;
export {};
