// Pounce core engine is purr thanks EL for naming that.
// We love cats


type Word = string | number;
type ValueStack = Array<Word>;
type ProgramList = Array<Word>;
interface WordDictionary {
  [key: string]: ProgramList | ((s: ValueStack) => ValueStack)
}


export function* purr(programList: ProgramList, wd: WordDictionary) {
  let pl = programList || [];
  let vstack = [];

  let w;
  const maxWordsProcessed = 100;
  let wordsProcessed = 0;
  while (wordsProcessed < maxWordsProcessed && (w = pl.shift())) {
    wordsProcessed += 1;
    let wds = wd[w];
    while (wds) {
      if (typeof wds === 'function') {
        wds(vstack);
        yield vstack;
      }
      else {
        pl.unshift(...wds);
      }
      w = pl.shift();
      wds = wd[w];
    }
    if (w) {
      vstack.push(w);
    }
    yield vstack;
  }
  if (wordsProcessed >= maxWordsProcessed) {
    yield "maxWordsProcessed exceeded: this may be a ";
  }
  else {
    yield "fin: all words have been processed with stack of [" + vstack + "]";
  }
}

// // pounce core
// import * as r from 'ramda';
// import { words } from './words';
// import { Dictionary, Word, DS } from './types';

// export const coreWords = words;

