// word dictionary types
import { ProgramList, ValueStack, TypeList, TypeStack, WordSignature } from "./types";

export type WordValue = {
    sig?: WordSignature;
    typeCompose: string | ProgramList | ((s: ValueStack, pl: ProgramList) =>
    [ValueStack, ProgramList?]); 
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) =>
        [ValueStack, ProgramList?]);
};
export type WordDictionary = {
    [index: string]: WordValue
};
