import { ProgramList, ValueStack } from "./types";
export declare type WordDictionary = {
    [key in string | number]: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList]);
};
