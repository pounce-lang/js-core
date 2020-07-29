import * as r from "ramda";
import { WordDictionary, WordValue } from "../WordDictionary.types";
import { ProgramList, Word } from '../types';
import NP from 'number-precision';
import { introspectWords, introspectWord } from "../interpreter";

export const toNumOrNull = (u: any): number | null =>
    r.is(Number, u) ? u : null;
export const toArrOrNull = (u: any): [] | null =>
    r.is(Array, u) ? u : null;
const toArrOfStrOrNull = (u: any): string[] | null =>
    r.is(Array, u) ? u : null;
export const toStringOrNull = (u: any): string | null =>
    r.is(String, u) ? u : null;
export const toPLOrNull = (u: any): ProgramList | null =>
    r.is(Array, u) ? u : null;
const toBoolOrNull = (u: any): boolean | null =>
    r.is(Boolean, u) ? u : null;
const toWordOrNull = (u: any): Word | null => {
    //string | number | Word[] | boolean | { [index: string]: Word }
    if (toStringOrNull(u) !== null) {
        return u;
    }
    if (toNumOrNull(u) !== null) {
        return u;
    }
    if (toArrOrNull(u) !== null) {
        return u;
    }
    if (toBoolOrNull(u) !== null) {
        return u;
    }
    if (r.is(Object, u) !== null) {
        return u;
    }
    return null;
}
// const toWordDictionaryOrNull = (u: any): WordDictionary | null =>
//     r.is(Object, u) ? u : null;

// const fetchProp = (wd: { [index: string]: Word }) => (w: Word, s: string | null) => {
//     const res = r.prop(s, wd);
//     if (!res) {
//         return res;
//     }
//     return w;
// };
const consReslover = (localWD: { [index: string]: Word }) => (w: Word): Word => {
    if (r.is(String, w)) {
        const newW = toWordOrNull(r.propOr(w, w as string, localWD));
        return newW !== null ? newW : w;
    }
    const subList = toPLOrNull(w);
    if (r.is(Array, subList)) {
        return subInWD(localWD, [...subList]);
    }
    return w;
};

const subInWD = (localWD: { [index: string]: Word }, words: Word[]): Word[] => {
    const resolveWord = consReslover(localWD);
    return r.map(resolveWord, words);
}

export const coreWords: WordDictionary = {
    'words': {
        sig: [[], [{ type: 'list' }]],
        def: (s) => {
            s.push(introspectWords());
            return [s];
        }
    },
    // introspectWord
    'word': {
        sig: [[{ type: 'list<string>)' }], [{ type: 'record' }]],
        def: s => {
            const phrase = toArrOfStrOrNull(s.pop());
            const wordName = toStringOrNull(phrase[0]);
            if (wordName) {
                s.push(introspectWord(wordName));
                return [s];
            }
            return null;
        }
    },
    'dup': {
        sig: [[{ type: 'A', use: 'observe' }], [{ type: 'A' }]],
        def: s => { s.push(s[s.length - 1]); return [s]; }
    },
    //    'dup': s => { s.push(JSON.parse(JSON.stringify(s[s.length - 1]))); return [s]; },
    'swap': {
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'B' }, { type: 'A' }]],
        def: s => {
            const top = s.pop();
            const under = s.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': {
        sig: [[{ type: 'any' }], []],
        def: s => { s.pop(); return [s]; }
    },
    'round': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        def: s => {
            // const b = <number | null>toTypeOrNull<number | null>(s.pop(), '(int | float)');
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(NP.round(a, b));
                return [s];
            }
            return null;
        }
    },
    'abs': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        def: s => {
            const a = toNumOrNull(s.pop());
            if (a !== null) {
                s.push(Math.abs(a));
                return [s];
            }
            return null;
        }
    },
    '+': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        def: s => {
            // const b = <number | null>toTypeOrNull<number | null>(s.pop(), '(int | float)');
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(NP.plus(a, b));
                return [s];
            }
            return null;
        }
    },
    '-': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(NP.minus(a, b));
                return [s];
            }
            return null;
        }
    },
    '/': {
        sig: [[{ type: 'number' }, { type: 'number', gaurd: [0, '!='] }], [{ type: 'number' }]],
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(NP.divide(a, b));
                return [s];
            }
            return null;
        }
    },
    '%': {
        sig: [[{ type: 'number' }, { type: 'number', gaurd: [0, '!='] }], [{ type: 'number' }]],
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(a % b);
                return [s];
            }
            return null;
        }
    },
    '*': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(NP.times(a, b));
                return [s];
            }
            return null;
        }
    },
    'apply': {
        sig: [[{ type: 'P extends (list<words>)', use: 'run!' }], [{ type: 'result(P)' }]],
        def: (s, pl) => {
            const block = toPLOrNull(s.pop());
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        }
    },
    'apply-with': {
        sig: [[{ type: 'Args extends (list<string>)', use: 'pop-each!' }, { type: 'P extends (list<words>)', use: 'run!' }], [{ type: 'result(P)' }]],
        def: (s, pl) => {
            const words = toPLOrNull(s.pop());
            const argList = toArrOfStrOrNull(s.pop());
            if (words !== null && argList) {
                const values: Word[] = r.map(() => s.pop(), argList);
                const localWD: { [index: string]: Word } =
                    r.zipObj(r.reverse(argList), values);
                const newWords: ProgramList =
                    toPLOrNull(subInWD(localWD, words));

                if (newWords) {
                    pl = newWords.concat(pl);
                }
            }
            else {
                // pl.unshift(block);
            }
            return [s, pl];
        }
    },
    'dip': {
        sig: [[{ type: 'A' }, { type: 'list<word>', use: 'run' }], [{ type: 'run-result' }, { type: 'A' }]],
        def: (s, pl) => {
            const block = toPLOrNull(s.pop());
            const item = s.pop();
            pl = [item].concat(pl);
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        }
    },
    'dip2': {
        sig: [[{ type: 'a' }, { type: 'b' }, { type: 'list<word>', use: 'run' }], [{ type: 'run-result' }, { type: 'a' }, { type: 'b' }]],
        def: (s, pl) => {
            const block = toPLOrNull(s.pop());
            const item2 = s.pop();
            pl = [item2].concat(pl);
            const item1 = s.pop();
            pl = [item1].concat(pl);
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        }
    },
    'rotate': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'C' }, { type: 'B' }, { type: 'A' }]],
        def: ['swap', ['swap'], 'dip', 'swap']
    },
    'rollup': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'C' }, { type: 'A' }, { type: 'B' }]],
        def: ['swap', ['swap'], 'dip']
    },
    'rolldown': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'B' }, { type: 'C' }, { type: 'A' }]],
        def: [['swap'], 'dip', 'swap']
    },
    'if-else': {
        def: (s, pl) => {
            const else_block = toPLOrNull(s.pop());
            const then_block = toPLOrNull(s.pop());
            const condition = toBoolOrNull(s.pop());
            if (condition === null || then_block === null || else_block === null) {
                return null;
            }
            if (condition) {
                if (r.is(Array, then_block)) {
                    pl = then_block.concat(pl);
                }
                else {
                    pl.unshift(then_block);
                }
            }
            else {
                if (r.is(Array, else_block)) {
                    pl = else_block.concat(pl);
                }
                else {
                    pl.unshift(else_block);
                }
            }
            return [s, pl];
        }
    },
    'ifte': {
        // expects: [{ desc: 'conditional', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally apply the first or second quotation',
        def: [['apply'], 'dip2', 'if-else']
    },
    '=': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s[s.length - 1]);
            if (a !== null && b !== null) {
                s.push(a === b);
            }
            return [s];
        }
    },
    '==': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a === b);
            }
            return [s];
        }
    },
    '!=': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a !== b);
            }
            return [s];
        }
    },
    '>': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a > b);
            }
            return [s];
        }
    },
    '<': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a < b);
            }
            return [s];
        }
    },
    '>=': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a >= b);
            }
            return [s];
        }
    },
    '<=': {
        def: s => {
            const b = toNumOrNull(s.pop());
            const a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a <= b);
            }
            return [s];
        }
    },
    'concat': {
        def: s => {
            const b = toArrOrNull(s.pop());
            const a = toArrOrNull(s.pop());
            if (a && b) {
                s.push([...a, ...b]);
            }
            return [s];
        }
    },
    'cons': {
        def: s => {
            const b = toArrOrNull(s.pop());
            const a = s.pop();
            if (b) {
                s.push([a, ...b]);
            }
            return [s];
        }
    },
    'uncons': {
        def: s => {
            const arr = toArrOrNull(s.pop());
            if (arr) {
                s.push(r.head(arr), r.tail(arr));
            }
            return [s];
        }
    },
    'push': {
        def: s => {
            const item = s.pop();
            const arr = toArrOrNull(s.pop());
            if (arr) {
                s.push([...arr, item]);
            }
            return [s];
        }
    },
    'pop': {
        def: s => {
            const arr = toArrOrNull(s.pop());
            if (arr) {
                s.push(r.init(arr), r.last(arr));
            }
            return [s];
        }
    },
    'constrec': {
        sig: [[
            { type: 'Initial extends (list<words>)' },
            { type: 'Increment extends (list<words>)' },
            { type: 'Condition extends (list<words>)' },
            { type: 'Recurse extends (list<words>)' },
            { type: 'Final extends (list<words>)' }
        ], []],
        def: (s, pl) => {
            // initial increment condition recurse final constrec
            const final = toPLOrNull(s.pop());
            const recurse = toPLOrNull(s.pop());
            const condition = toPLOrNull(s.pop());
            const increment = toPLOrNull(s.pop());
            const initial = toPLOrNull(s.pop());
            if (initial && increment && condition && recurse && final) {
                const nextRec = [[], increment, condition, recurse, final, 'constrec'];
                pl = [...initial, ...increment, ...condition, [...recurse, ...nextRec], final, 'if-else'].concat(pl);
            }
            else {
                // throw new Error("stack value(s) not found");
            }
            return [s, pl];
        }
    },
    'linrec': {
        sig: [[
            { type: 'TermTest extends (list<words>)' },
            { type: 'Terminal extends (list<words>)' },
            { type: 'Recurse extends (list<words>)' },
            { type: 'Final extends (list<words>)' }
        ], []],
        def: (s, pl) => {
            // termtest && terminal && recurse && final linrec 
            const final = toPLOrNull(s.pop());
            const recurse = toPLOrNull(s.pop());
            const terminal = toPLOrNull(s.pop());
            const termtest = toPLOrNull(s.pop());
            if (termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'linrec', ...final];
                pl = [...termtest, terminal, [...recurse, ...nextRec], 'if-else'].concat(pl);
            }
            else {
                console.log("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'linrec5': {
        sig: [[
            { type: 'Init extends (list<words>)' },
            { type: 'TermTest extends (list<words>)' },
            { type: 'Terminal extends (list<words>)' },
            { type: 'Recurse extends (list<words>)' },
            { type: 'Final extends (list<words>)' }
        ], []],
        def: (s, pl) => {
            // termtest && terminal && recurse && final linrec 
            const final = toPLOrNull(s.pop());
            const recurse = toPLOrNull(s.pop());
            const terminal = toPLOrNull(s.pop());
            const termtest = toPLOrNull(s.pop());
            const init = toPLOrNull(s.pop());
            if (init && termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'linrec', ...final];
                pl = [...init, ...termtest, terminal, [...recurse, ...nextRec], 'if-else'].concat(pl);
            }
            else {
                console.log("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'binrec': {
        sig: [[
            { type: 'TermTest extends (list<words>)' },
            { type: 'Terminal extends (list<words>)' },
            { type: 'Recurse extends (list<words>)' },
            { type: 'Final extends (list<words>)' }
        ], []],
        def: (s, pl) => {
            // termtest && terminal && recurse && final binrec 
            const final = toPLOrNull(s.pop());
            const recurse = toPLOrNull(s.pop());
            const terminal = toPLOrNull(s.pop());
            const termtest = toPLOrNull(s.pop());
            if (termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'binrec'];
                pl = [...termtest, terminal, [...recurse, [...nextRec], 'dip', ...nextRec, ...final], 'if-else'].concat(pl);
            }
            else {
                console.log("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'dup2': {
        sig: [[{ type: 'A', use: 'observe' }, { type: 'B', use: 'observe' }], [{ type: 'A' }, { type: 'B' }]],
        def: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    },
    'times': {
        sig: [[{ type: 'P extends (list<words>)', use: 'runs' }, { type: 'int as n' }], [{ type: 'P n times' }]],
        def: ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'times'], ['drop', 'drop'], 'if-else']
    },
    'map': {
        sig: [
            [{ type: 'ValueList extends (list<words>)' },
            { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]],
        def: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["phrase", 'apply'], 'dip', "swap", 'push'], 'dip'],
            [], 'linrec5'
        ], "apply-with"]
    },
    'filter': {
        sig: [
            [{ type: 'ValueList extends (list<words>)' },
            { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]],
        def: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["dup", "phrase", 'apply'], 'dip', "rollup", ['push'], ['drop'], 'if-else'], 'dip'],
            [], 'linrec5'
        ], "apply-with"]
    },
    'reduce': {
        sig: [
            [{ type: 'ValueList extends (list<words>)' },
            { type: 'Accumulater (word)' },
            { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]],
        def: [["list", "acc", "phrase"], [
            ["acc", "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["phrase", "apply"], 'dip'],
            [], 'linrec5'
        ], "apply-with"]
    },

    'split': {
        def: [["cutVal", "theList", "operator"], [
            [], [], "cutVal", "theList",
            'size',
            ['uncons',
                ['dup2', "operator", "apply",
                    ['swap', ['swap', ['push'], 'dip'], 'dip'],
                    ['swap', ['push'], 'dip'], 'if-else'], 'dip',
            ], 'swap', 'times', 'drop', 'swap', ['push'], 'dip'
        ], "apply-with"]
    },
    'size': {
        def: s => {
            const arr = toArrOrNull(s[s.length - 1]);
            if (arr) {
                s.push(arr.length);
            }
            return [s];
        }
    },
    'depth': {
        def: s => {
            s.push(s.length);
            return [s];
        }
    },
    'stack-copy': {
        def: s => {
            s.push([...s]);
            return [s];
        }
    },
    'popInternalCallStack': {
        def: []
    }
    // // 'import': {
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const importable = toString(s.pop());
    // //         if (typeof importable === 'string') {
    // //             if (imported[importable]) {
    // //                 // already imported
    // //                 return [s, pl];
    // //             }
    // //             // given a path to a dictionary load it or fetch and load
    // //             // options are to extend the core dictionary or pushit on a stack
    // //             // 1. Object.assign(window[importable].words, wordstack[0]);
    // //             // 2. wordstack.push(window[importable].words);
    // //             if (window[importable]) {
    // //                 imported[importable] = true;
    // //                 wordstack.push(window[importable].words);
    // //             } else {
    // //                 console.log('TBD: code to load resourse:', importable)
    // //             }
    // //         } else {
    // //             // given a dictionary
    // //             wordstack.push(importable);
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'random': {
    // //     definition: function (s: Json[]) {
    // //         s.push(Math.random());
    // //         return [s, pl];
    // //     }
    // // },
    // // 'round': {
    // //     definition: function (s: Json[]) {
    // //         const pres = s.pop();
    // //         const n = s.pop();
    // //         s.push(Math.round(n / pres) * pres);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'abs': {
    // //     definition: function (s: Json[]) {
    // //         const n = s.pop();
    // //         s.push(Math.abs(n));
    // //         return [s, pl];
    // //     }
    // // },
    // // 's2int': {
    // //     expects: [{ desc: 'a number in a string', ofType: 'string' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s.pop();
    // //         const str = toString(s.pop());
    // //         s.push(Number.parseInt(str, radix));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'int2s': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s.pop();
    // //         const n = s.pop();
    // //         s.push(n.toString(radix));
    // //         return [s, pl];
    // //     }
    // // },
    // // '<<': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n << shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // '>>': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n >> shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'XOR': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n ^ shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'AND': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n & shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.set': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         localStorage.setItem(name, JSON.stringify(s.pop()));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.get': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         s.push(JSON.parse(localStorage.getItem(name)));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.remove': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         localStorage.removeItem(name);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'depth': {
    // //     expects: [], effects: [1], tests: [], desc: 'stack depth',
    // //     definition: function (s: Json[], pl: PL) {
    // //         s.push(s.length);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'and': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical and',
    // //     definition: function (s: Json[]) {
    // //         const b = toBoolean(s.pop());
    // //         const a = toBoolean(s.pop());
    // //         s.push(a && b);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'or': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical or',
    // //     definition: function (s: Json[]) {
    // //         const b = toBoolean(s.pop());
    // //         const a = toBoolean(s.pop());
    // //         s.push(a || b);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'not': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }], effects: [0], tests: [], desc: 'logical not',
    // //     definition: function (s: Json[]) {
    // //         const a = toBoolean(s.pop());
    // //         s.push(!a);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'bubble-up': {
    // //     'requires': 'list_module',
    // //     'named-args': ['c'],
    // //     'local-words': {
    // //     },
    // //     'definition': [[], ['cons'], 'c', 'repeat', 'swap', [['uncons'], 'c', 'repeat', 'drop'], 'dip']
    // // },
    // // 'case': {
    // //     expects: [{ desc: 'key', ofType: 'word' }, { desc: 'a', ofType: 'record' }], effects: [-2], tests: [], desc: 'apply a matching case',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const case_record = s.pop();
    // //         let key = s.pop();
    // //         if (key === " ") {
    // //             key = "' '";
    // //         }
    // //         if (case_record[key]) {
    // //             if (isArray(case_record[key])) {
    // //                 pl = [case_record[key]].concat(pl);
    // //             }
    // //             else {
    // //                 pl.unshift(case_record[key]);
    // //             }
    // //         }
    // //         else {
    // //             s.push(false);
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'floor': ['dup', 1, '%', '-'],
    // // 'filter': {
    // //     'requires': 'list_module',
    // //     'local-words': {
    // //         'setup-filter': [[]],
    // //         'process-filter': [
    // //             ["size"], "dip2", "rolldown", 0, ">",
    // //             ["rotate", "pop", "rolldown", ["dup"], "dip", "dup", ["apply"], "dip", "swap",
    // //                 [["swap"], "dip2", ["prepend"], "dip"],
    // //                 [["swap"], "dip2", ["drop"], "dip"], "if-else", "swap", "process-filter"],
    // //             [["drop", "drop"], "dip"], "if-else"]
    // //     },
    // //     'definition': ['setup-filter', 'process-filter']
    // // },
    // // 'reduce': {
    // //     'requires': 'list_module',
    // //     'local-words': {
    // //         'more?': ['rolldown', 'size', 0, '>', ['rollup'], 'dip'],
    // //         'process-reduce': ['more?', ['reduce-step', 'process-reduce'], 'if'],
    // //         'reduce-step': [['pop'], 'dip2', 'dup', [['swap'], 'dip', 'apply'], 'dip'],
    // //         'teardown-reduce': ['drop', ['drop'], 'dip'],
    // //     },
    // //     'definition': ['process-reduce', 'teardown-reduce']
    // // }

};