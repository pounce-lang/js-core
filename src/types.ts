
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

export type Word =
    | string;
export type WordArr =
    | string[];
export type Dictionary =
    | { [keyof: string]: Word };

export type DS = Dictionary[]
// export type WordObj =
//     {
//         expects: {
//             desc: string;
//             ofType: string;
//         }[];
//         effects: number[];
//         tests: Json[];
//         desc: string;
//         definition: (stack: Json[], pl: Word[], ws: WS) => [Json[], Word[], WS];
//     };

// export type Word =
//     | WordArr
//     | WordObj;


