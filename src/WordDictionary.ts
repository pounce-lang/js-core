import { ProgramList, ValueStack } from "./types";
export type WordDictionary = {
    [key in string | number]: 
        ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList]);
};
// [ValueStack, ProgramList] or Array<ValueStack | ProgramList> IDK