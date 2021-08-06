export declare type Word = string | number | Word[] | boolean | {
    [index: string]: Word;
};
export declare type WordType = string | WordType[];
export declare type ValueStack = Word[];
export declare type TypeStack = (Word | WordType)[];
export declare type ProgramList = Word[];
export declare type TypeList = (Word | WordType)[];
export declare type Signature = {
    type: string;
    guard?: Word[];
    use?: string;
}[];
export declare type WordSignature = Signature[];
