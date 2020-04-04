
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
    export type Word = string | number | Array<Word>;
    export type ValueStack = Array<Word>;
    export type ProgramList = Array<Word>;

