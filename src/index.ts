// pounce core
import * as r from 'ramda';
import { words } from './words';
import { Dictionary, Word, DS } from './types';

export const coreWords = words;

const hasWord = (k: string) => (o: object): boolean => r.complement(r.isNil)(r.prop(k)(o));

const runWord = (term: string, wd: Word, pl: Word[], stack: Word[], wordstack: DS): [Word[], Word[], DS] => {
  if(r.is(Array, wd)) {
    console.log(term);
    const newPl = r.prepend(wd[0], pl);
    return [newPl, stack, wordstack];
  }
  // if(r.is(Object, wd) && hasWord('definition')(wd)) {
  //   // const definition: (stack: Word[], pl: Word[], ws: WS) => [Word[], Word[], WS] = r.prop("definition")(wd);
  //   // if(definition && r.is(Function, definition)) {
  //   //   const [nextStack, nextPl, nextWordStack] = definition(stack, pl, wordstack);
  //   //   return [nextPl, nextStack, nextWordStack];
  //   // }
  //   // else {
  //   //   return [pl, stack, wordstack];
  //   // }
  // }

  return [pl, stack, wordstack];
}

export const parse = (ps: string) => r.split(' ', ps);
export const pounce = (pl: Word[], stack: Word[], wordstack: DS): any[] => {
  if (pl.length > 0) {
    const term = r.head(pl);
    const restPl = r.tail(pl);
    if (r.is(Array, term)) {
      return pounce(restPl, r.append(term, stack), wordstack);
    }
    else if (r.is(String, term)) {
      const termStr: string = term.toString();
      console.log(term);
      const thisWord = r.findLast(hasWord(termStr))(wordstack);
      console.log('*** thisWord', thisWord);
      const thisWD = r.prop(termStr);
      console.log('*** thisWD', thisWD(thisWord as object));
      if (thisWord && r.complement(r.isNil)(thisWD(thisWord as object))) {
        const [nextPl, nextStack, nextWordStack] = runWord(termStr, thisWD(thisWord as Record<string, Word>), stack, pl, wordstack);
        return pounce(nextPl, nextStack, nextWordStack);
      }
      else {
        return pounce(restPl, r.append(term, stack), wordstack);
      }
    }
  }
  return ([pl, stack, wordstack]);
};

////////////////////////////////////////////
// run expects a parsed program list (pl).
// a stack that usually would be empty, but may be primed with an existing state
// a stack of dictionaries of words.
let imported = {};
function tryConvertToNumber(w: string) {
  return number_or_str(w);
}

function number_or_str(s: string) {
  var num;
  if (!isNaN(parseFloat(s))) {
    num = parseFloat(s);
    if (('' + num).length === s.length || s[s.length - 1] == '.' || s[s.length - 1] == '0' || s[0] == '.') {
      if (s.indexOf('.') === s.lastIndexOf('.')) {
        return num;
      }
    }
  }
  if (!isNaN(parseInt(s, 10))) {
    num = parseInt(s, 10);
    if (('' + num).length === s.length) {
      return num;
    }
  }
  return s;
}

function cloneItem(item: any) {
  // return cloneObject(item);
  if (item !== undefined) {
    return JSON.parse(JSON.stringify(item));
  }
  return item;
}

// function cloneObject(obj) {
//   let clone = {};
//   if (typeof obj !== "object") {
//     return obj;
//   }
//   else {
//     if (isArray(obj)) {
//       clone = [];
//     }
//     for (let i in obj) {
//       if (obj[i] !== null && typeof (obj[i]) === "object")
//         clone[i] = cloneObject(obj[i]);
//       else
//         clone[i] = obj[i];
//     }
//     return clone;
//   }
// }

// // alternate clone ?? merits ??
// function cloneAnyObj(o) {
//   let newObj = (o instanceof Array) ? [] : {};
//   let i;
//   for (i in o) {
//     if (i == 'clone') continue;
//     if (o[i] && typeof o[i] == "object") {
//       newObj[i] = cloneAnyObj(o[i]);
//     } else {
//       newObj[i] = o[i];
//     }
//   }
//   return newObj;
// }

function isInternalWord(term: string) {
  return (term === 'internal=>drop-local-words');
}

// a filter that filters out internal words 'internal=>drop-local-words'
function ixnay(l: []) {
  const new_l = l.filter(element => !isInternalWord(element));
  return new_l;
}

function isArray(candidate: any): boolean {
  return r.is(Array, candidate);
}

function isObject(candidate: any) {
  return r.is(Object, candidate);
}

function isNumber(value: any) {
  return typeof value === 'number' && isFinite(value);
}

// function cleanQuotedItems(stack: []) {
//   return stack.map(e => {
//     if (isArray(e) || typeof e === "object") {
//       return unParse([e]);
//     } else {
//       return e;
//     }
//   });
// }

function unParse(pl: []) {
  let ps = '';
  let spacer = '';
  for (let i in pl) {
    if (pl[i] && typeof pl[i] == "object") {
      if (isArray(pl[i])) {
        ps += spacer + '[' + unParse(pl[i]) + ']';
      }
      else {
        ps += spacer + '{' + unParseKeyValuePair(pl[i]) + '}';
      }
    }
    else {
      ps += spacer + pl[i];
    }
    spacer = ' ';
  }
  return ps;
}

function unParseKeyValuePair(pl: []) {
  let ps = '';
  let spacer = '';
  for (let i in pl) {
    if (pl.hasOwnProperty(i)) {
      if (pl[i] && typeof pl[i] == "object") {
        if (isArray(pl[i])) {
          ps += spacer + i + ':[' + unParse(pl[i]) + ']';
        }
        else {
          ps += spacer + i + ':{' + unParseKeyValuePair(pl[i]) + '}';
        }
      }
      else {
        ps += spacer + i + ':' + pl[i];
      }
      spacer = ' ';
    }
  }
  return ps;
}





    // halt = false;
    // while (pl.length > 0 && !halt && reps < maxReps) {
    //   reps += 1;
    //   term = pl.shift(); // r.head(pl);
    //   let num;
    //   let handled = false;
    //   if (typeof term === 'string') {
    //     let thisWord = r.findLast(hasIt(term))(wordstack);
    //     if (isArray(thisWord)) {
    //       // console.log('unquote list ', stack, term, pl);
    //       pl = r.concat([thisWord], pl);
    //       // console.log('post-unquote ', stack, pl);
    //       handled = true;
    //     }
    //     if  (thisWord && isArray(thisWord.definition)) {
    //       if (thisWord.requires && !imported[thisWord.requires]) {
    //         stack.push(thisWord.requires);
    //         [stack] = wordstack[0].import.definition(stack, pl, wordstack);
    //       }
    //       if (thisWord['local-words'] || thisWord['named-args']) {
    //         if (thisWord['local-words']) {
    //           wordstack.push(thisWord['local-words']);
    //           pl = thisWord.definition.concat(['internal=>drop-local-words']).concat(pl);
    //         }
    //         if (thisWord['named-args'] && isArray(thisWord['named-args'])) {
    //           const top = wordstack.length - 1;
    //           for (let var_name of thisWord['named-args']) {
    //             // [] swap push [c] local-def
    //             pl = [[], 'cons', [var_name], 'local-def'].concat(pl);
    //           }
    //         }
    //       }
    //       else {
    //         // console.log('unquote definition list ', stack, term, pl);
    //         pl = thisWord.definition.concat(pl);
    //         // console.log('post-unquote ', stack, pl);
    //       }
    //       handled = true;
    //     }
    //     if (thisWord && thisWord.definition && typeof thisWord.definition === 'function') {
    //       // console.log('pre-execute ', stack, term, pl);
    //       [stack, pl = pl] = thisWord.definition(stack, pl, wordstack);
    //       // console.log('post-execute ', stack, pl );
    //       handled = true;
    //     }
    //     if (!handled) {
    //       num = tryConvertToNumber(term);
    //       stack.push(num);
    //     }
    //   }
    //   else {
    //     num = tryConvertToNumber(term);
    //     if (isArray(term) || !isNumber(num)) {
    //       stack.push(cloneItem(term));
    //     }
    //     else {
    //       stack.push(num);
    //     }
    //   }
    // }
