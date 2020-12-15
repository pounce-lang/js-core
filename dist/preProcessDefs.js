var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// preProcessDefs (aka Insizer)
import * as r from 'ramda';
import { toPLOrNull, toStringOrNull, toArrOrNull } from './words/core';
export var preProcessDefs = function (pl, coreWords) {
    var defineWord = function (wd, key, val) {
        var new_word = {};
        new_word[key] = val;
        // ToDo: implement a safe mode that would throw a preProcesser error if key is already defined.
        return r.mergeRight(wd, new_word);
    };
    // non-FP section (candidate for refactor)
    var next_pl = __spreadArrays(pl);
    var next_wd = {};
    var def_i = r.findIndex(function (word) { return word === 'compose'; }, next_pl);
    while (def_i !== -1) {
        if (def_i >= 2) {
            var word = toPLOrNull(next_pl[def_i - 2]);
            var key = toStringOrNull(r.head(toArrOrNull(next_pl[def_i - 1])));
            next_pl.splice(def_i - 2, 3); // splice is particularly mutant
            next_wd = defineWord(next_wd, key, { "compose": word });
        }
        def_i = r.findIndex(function (word) { return word === 'compose'; }, next_pl);
    }
    return [next_pl, r.mergeRight(coreWords, next_wd)];
};
