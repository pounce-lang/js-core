import * as r from "ramda";
import { WordDictionary } from "../WordDictionary";
import { Word } from '../types';
export const coreWords: WordDictionary = {
    dup: s => { s.push(s[s.length - 1]); return s; },
    pop: s => { 
        const top = s[s.length - 1];
        if (r.is(Array, top)) {
            s.push(r.last(top as Array<Word>));
        }
        return s; 
    },
    drop: s => { s.pop();return s; },
};