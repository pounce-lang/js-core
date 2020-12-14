export declare type Word = string | number | Word[] | boolean | {
    [index: string]: Word;
};
export declare type ValueStack = Word[];
export declare type ProgramList = Word[];
export declare type Sig = {
    type: string | string[];
    gaurd?: Word[];
    use?: string;
};
export declare type Signature = Sig[];
export declare type WordSignature = Signature[];
export declare type CombinedSig = {
    in: Sig | null;
    out: Sig | null;
};
