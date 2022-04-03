import { ProgramList, ValueStack, WordSignature } from "./types";
export declare type WordValue = {
    dt?: string;
    sig?: WordSignature;
    typeCompose: string | ProgramList | ((s: ValueStack, pl: ProgramList, wd?: WordDictionary) => [ValueStack, ProgramList?]);
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList?]);
};
export declare type WordDictionary = {
    [index: string]: WordValue;
};
