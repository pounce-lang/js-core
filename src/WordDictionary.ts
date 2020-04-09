import { ProgramList, ValueStack } from "./types";
export type WordDictionary = {
    [key in string | number]: 
        { def: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList?]);
}};
export type StackOfDictionaries = WordDictionary[];