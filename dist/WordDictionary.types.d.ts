import { ProgramList, ValueStack } from "./types";
export declare type WordValue = {
    dt?: string;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) => [ValueStack, ProgramList?]);
};
export declare type WordDictionary = {
    [index: string]: WordValue;
};
