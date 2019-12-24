
export type Json =
    | string
    | number
    | boolean
    | null
    | { [property: string]: Json }
    | Json[];

export type PL = Json[];

// export type FnRet =  [Json[], PL | undefined, Dictionary | undefined];
// export type DefFn = function (Json[], PL | undefined, Dictionary[] | undefined): FnRet => void;

// export type Word = 
// | { [property: string]: Json | DefFn }
// | Json[];
export type WordArr =
    | Json[];

export type WordObj =
    {
        expects: {
            desc: string;
            ofType: string;
        }[];
        effects: number[];
        tests: Json[];
        desc: string;
        definition: (stack: Json[], pl: Word[], ws: WS) => [Json[], Word[], WS];
    };

export type Word = 
    | WordArr
    | WordObj;


export type Dictionary =
    | { [keyof: string]: Word };

export type WS = Dictionary[]