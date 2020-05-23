import { interpreter as purr } from './interpreter';
export declare const parse: (input: string, options: any) => any;
export declare const unParse: (pl: any[]) => string;
export declare const interpreter: typeof purr;
export declare const coreWordDictionary: import("./WordDictionary.types").WordDictionary;
