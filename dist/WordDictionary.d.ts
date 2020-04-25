import { ProgramList, ValueStack } from "./types";
export declare type WordDictionary = {
    [key in string | number]: {
        def: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList?, StackOfDictionaries?]);
    };
};
export declare type StackOfDictionaries = WordDictionary[];
