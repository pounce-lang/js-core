import { ProgramList } from './types';
import { WordDictionary } from "./WordDictionary.types";
export declare const preProcessDefs: (pl: ProgramList, coreWords: WordDictionary) => [ProgramList, WordDictionary];
export declare const preCheckTypes: (pl: ProgramList, wd: WordDictionary) => any[] | "not implemented";
