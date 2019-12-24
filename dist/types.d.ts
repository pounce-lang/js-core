export declare type Json = string | number | boolean | null | {
    [property: string]: Json;
} | Json[];
export declare type PL = Json[];
export declare type WordArr = Json[];
export declare type WordObj = {
    expects: {
        desc: string;
        ofType: string;
    }[];
    effects: number[];
    tests: Json[];
    desc: string;
    definition: (stack: Json[], pl: Word[], ws: WS) => [Json[], Word[], WS];
};
export declare type Word = WordArr | WordObj;
export declare type Dictionary = {
    [keyof: string]: Word;
};
export declare type WS = Dictionary[];
