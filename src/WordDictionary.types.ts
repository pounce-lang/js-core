import { ProgramList, ValueStack, WordSignature } from "./types";

export type WordValue = {
    sig?: WordSignature;
    def: ProgramList | ((s: ValueStack, pl: ProgramList, wd?: WordDictionary) =>
        [ValueStack, ProgramList?, WordDictionary?]);
};
export type WordDictionary = {
    [key in string | number]: (WordValue | WordDictionary)
};
// v0 used a stack of dictionaries, v1 to use namespaces
// export type StackOfDictionaries = WordDictionary[];
