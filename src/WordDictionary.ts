import { ProgramList, ValueStack } from "./types";
export type WordDictionary = {
    [key in string | number]: ProgramList | ((s: ValueStack) => ValueStack);
};
