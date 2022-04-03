// word dictionary types
import { ProgramList, ValueStack, TypeList, TypeStack, WordSignature } from "./types";

export type WordValue = {
    dt?: string;
    sig?: WordSignature;
    typeCompose: string | ProgramList | ((s: ValueStack, pl: ProgramList, wd?: WordDictionary) =>
    [ValueStack, ProgramList?]); 
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) =>
        [ValueStack, ProgramList?]);
};
export type WordDictionary = {
    [index: string]: WordValue
};
