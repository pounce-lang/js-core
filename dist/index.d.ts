import { DS } from './types';
export declare const coreWords: {
    [keyof: string]: string;
};
export declare const parse: (ps: string) => string[];
export declare const pounce: (pl: string[], stack: string[], wordstack: DS) => any[];
