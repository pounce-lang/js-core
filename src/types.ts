
// export type Json =
//     | string
//     | number
//     | boolean
//     | null
//     | { [property: string]: Json }
//     | Json[];

// export type PL = Json[];

// export type FnRet =  [Json[], PL | undefined, Dictionary | undefined];
// export type DefFn = function (Json[], PL | undefined, Dictionary[] | undefined): FnRet => void;

declare module "pTypes" {
    export type Word = string | number;
    export type ValueStack = Array<Word>;
    export type ProgramList = Array<Word>;
    export interface WordDictionary {
        [key: string]: ProgramList | ((s: ValueStack) => ValueStack)
    }

}

