'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var r = require('ramda');

// pounce core
var hasWord = function (k) { return function (o) { return r.complement(r.isNil)(r.prop(k)(o)); }; };
var parse = function (ps) { return r.split(' ', ps); };
var pounce = function (pl, stack, wordstack) {
    if (stack === void 0) { stack = []; }
    if (pl.length > 0) {
        var term = r.head(pl);
        var restPl = r.tail(pl);
        if (r.is(Array, term) || r.is(Object, term)) {
            return pounce(restPl, r.append(term, stack), wordstack);
        }
        else if (r.is(String, term)) {
            console.log(term);
            var thisWord = r.findLast(hasWord(term))(wordstack);
            console.log('*** thisWord', thisWord);
            // if (thisWord) {
            //   [nextPl, newStack, newWordStack] = runWord(thisWord, stack, pl);
            //   pounce(nextPl, newStack, newWordStack);
            // }
            // else {
            return pounce(restPl, r.append(term, stack), wordstack);
            // }
        }
    }
    return ([pl, stack, wordstack]);
};
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

exports.parse = parse;
exports.pounce = pounce;
