// Pounce core engine is purr thanks EL for naming that.
// We love cats


type Word = string | number;
type ValueStack = Array<Word>;
type ProgramList = Array<Word>;
type StackFunction = ((s: ValueStack) => ValueStack);
interface WordDictionary {
  [key: string]: ProgramList | StackFunction;
}


export function* purr(programList: ProgramList, wd: WordDictionary, opt: {debug?: boolean} = {debug: true}) {
  let pl = programList || [];
  let vstack: ValueStack = [];
  yield opt?.debug ? [vstack, pl]: null;
  let w;
  const maxWordsProcessed = 100;
  let wordsProcessed = 0;
  while (wordsProcessed < maxWordsProcessed && (w = pl.shift())) {
    wordsProcessed += 1;
    let wds = wd[w];
    while (wds) {
      if (typeof wds === 'function') {
        wds(vstack);
      }
      else {
        pl.unshift(...wds);
      }
      yield opt?.debug ? [vstack, pl]: null;
      w = pl.shift();
      wds = wd[w];
    }
    if (w) {
      vstack.push(w);
    }
    yield opt?.debug ? [vstack, pl]: null;
  }
  if (wordsProcessed >= maxWordsProcessed) {
    yield [[vstack, pl], "maxWordsProcessed exceeded: this may be an infinite loop "];
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

