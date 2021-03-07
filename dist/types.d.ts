export declare type Word = string | number | Word[] | boolean | {
    [index: string]: Word;
};
export declare type ValueStack = Word[];
export declare type ProgramList = Word[];
export declare type Signature = {
    type: string;
    guard?: Word[];
    use?: string;
}[];
export declare type WordSignature = Signature[];
