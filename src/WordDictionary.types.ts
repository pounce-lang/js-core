// word dictionary types
import { ProgramList, ValueStack } from "./types";

export type WordValue = {
    dt?: string;
    compose: ProgramList | ((s: ValueStack, pl: ProgramList) =>
        [ValueStack, ProgramList?]);
};
export type WordDictionary = {
    [index: string]: WordValue
};
