export declare type Json = string | number | boolean | null | {
    [property: string]: Json;
} | Json[];
export declare type PL = Json[];
export declare type Word = {
    [property: string]: Json;
} | Json[];
export declare type Dictionary = Word[];
export declare type DefFn = (s: [], pl: PL | undefined, ws: Dictionary[] | undefined) => {};
