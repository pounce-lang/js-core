import { ProgramList, ValueStack, CombinedSig } from "./types";
export declare type WordValue = {
    sig?: CombinedSig;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) => [
        ValueStack,
        ProgramList?
    ]);
};
export declare type WordDictionary = {
    [index: string]: WordValue;
};
