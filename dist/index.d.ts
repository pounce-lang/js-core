import { interpreter as interp, purr as purring } from './interpreter';
export declare const parse: (input: string, options?: any) => any;
export declare const unParse: (pl: any[]) => string;
export declare const interpreter: typeof interp;
export declare const coreWordDictionary: import("./WordDictionary.types").WordDictionary;
export declare const purr: typeof purring;
export declare const preProcessDefines: (pl: import("./types").ProgramList, coreWords: import("./WordDictionary.types").WordDictionary) => [import("./types").ProgramList, import("./WordDictionary.types").WordDictionary];
export declare const preProcessCheckTypes: (pl: import("./types").ProgramList, wd: import("./WordDictionary.types").WordDictionary) => any[] | "not implemented";
