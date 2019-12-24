import { Word } from './types';
export declare const coreWords: {
    [keyof: string]: Word;
};
export declare const parse: (ps: string) => string[];
export declare const pounce: (pl: Word[], stack: Word[], wordstack: {
    [keyof: string]: Word;
}[]) => any[];
