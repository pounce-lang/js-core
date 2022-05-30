import * as r from "ramda";
import { WordDictionary } from "../WordDictionary.types";
import { ProgramList, Word } from '../types';
import NP from 'number-precision';
import { unParser as unparse } from "../parser/Pinna";
import Prando from 'prando';

NP.enableBoundaryChecking(false);


export const compareObjects = (a: any, b: any) => {
    if (a === b) return true;

    if (typeof a != 'object' || typeof b != 'object' || a == null || b == null) return false;

    let keysA = Object.keys(a), keysB = Object.keys(b);

    if (keysA.length != keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key)) return false;

        if (typeof a[key] === 'function' || typeof b[key] === 'function') {
            if (a[key].toString() != b[key].toString()) return false;
        } else {
            if (!compareObjects(a[key], b[key])) return false;
        }
    }

    return true;
}

let rng: { next: () => number };

const toNumTypeOrNull = (u: any): number | null =>
    r.is(Number, u) || u === "number_t" ? u : null;
const toBoolTypeOrNull = (u: any): boolean | null =>
    r.is(Boolean, u) || u === "boolean_t" ? u : null;

export const toNumOrNull = (u: any): number | null =>
    r.is(Number, u) ? u : null;
export const toArrOrNull = (u: any): [] | null =>
    r.is(Array, u) ? u : null;
export const toArrOfStrOrNull = (u: any): string[] | null =>
    r.is(Array, u) ? u : null;
export const toStringOrNull = (u: any): string | null =>
    r.is(String, u) ? u : null;
export const toPLOrNull = (u: any): ProgramList | null =>
    r.is(Array, u) ? u : null;
export const toBoolOrNull = (u: any): boolean | null =>
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
        compose: (s) => {
            s.push(introspectWords());
            return [s];
        }
    },
    // introspectWord
    'word': {
        compose: s => {
            const phrase = toArrOfStrOrNull(s?.pop());
            const wordName = toStringOrNull(phrase[0]);
            if (wordName) {
                s.push(introspectWord(wordName));
                return [s];
            }
            return [null];
        }
    },
    'dup': {
        dt: '[[A][A A] bind]',
        compose: s => { s.push(clone(s[s.length - 1])); return [s]; }
        // s => { s.push(s[s.length - 1]); return [s]; }
    },
    'dup2': {
        dt: '[[C D][C D C D] bind]',
        compose: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    },
    'swap': {
        dt: '[[C D][D C] bind]',
        compose: s => {
            const top = s?.pop();
            const under = s?.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': {
        dt: '[[A][] bind]',
        compose: s => { s?.pop(); return [s]; }
    },
    'round': {
        compose: s => {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), 'number');
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(NP.round(a, b));
                return [s];
            }
            return [null];
        }
    },
    '+': {
        dt: '[[N N][N] comp]',
        compose: s => {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), 'number');
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(NP.plus(a, b));
                return [s];
            }
            return [null];
        }
    },
    '-': {
        dt: '[[N N] [N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(NP.minus(a, b));
                return [s];
            }
            return [null];
        }
    },
    '/': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(NP.divide(a, b));
                return [s];
            }
            return [null];
        }
    },
    '%': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(a % b);
                return [s];
            }
            return [null];
        }
    },
    '*': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(NP.times(a, b));
                return [s];
            }
            return [null];
        }
    },
    // bitwise on integers
    '&': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(a & b);
                return [s];
            }
            return [null];
        }
    },
    '|': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(a | b);
                return [s];
            }
            return [null];
        }
    },
    '^': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const b = toNumOrNull(s?.pop());
            const a = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(a ^ b);
                return [s];
            }
            return [null];
        }
    },
    '~': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(~a);
                return [s];
            }
            return [null];
        }
    },
    '&&': {
        dt: '[[B B] [B] comp]',
        compose: s => {
            const b = toBoolOrNull(s?.pop());
            const a = toBoolOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(a && b);
                return [s];
            }
            return [null];
        }
    },
    '||': {
        dt: '[[B B][B] comp]',
        compose: s => {
            const b = toBoolOrNull(s?.pop());
            const a = toBoolOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(a || b);
                return [s];
            }
            return [null];
        }
    },
    '!': {
        dt: '[[B][B] comp]',
        compose: s => {
            const a = toBoolOrNull(s?.pop());
            if (a !== null) {
                s.push(!a);
                return [s];
            }
            return [null];
        }
    },
    // Math.E
    'E': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.E);
            return [s];
        }
    },
    // Math.LN10
    'LN10': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.LN10);
            return [s];
        }
    },
    // Math.LN2
    'LN2': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.LN2);
            return [s];
        }
    },
    // Math.LOG10E
    'LOG10E': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.LOG10E);
            return [s];
        }
    },
    // Math.LOG2E
    'LOG2E': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.LOG2E);
            return [s];
        }
    },
    // Math.PI
    'PI': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.PI);
            return [s];
        }
    },
    // Math.SQRT1_2
    'SQRT1_2': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.SQRT1_2);
            return [s];
        }
    },
    // Math.SQRT2
    'SQRT2': {
        dt: '[[]][N] comp]',
        compose: s => {
            s.push(Math.SQRT2);
            return [s];
        }
    },
    // Math.abs()
    'abs': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.abs(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.acos()
    'acos': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.acos(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.acosh()
    'acosh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.acosh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.asin()
    'asin': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.asin(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.asinh()
    'asinh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.asinh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.atan()
    'atan': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.atan(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.atan2()
    'atan2': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            const b = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(Math.atan2(b, a));
                return [s];
            }
            return [null];
        }
    },
    // Math.atanh()
    'atanh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.atanh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.cbrt()
    'cbrt': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.cbrt(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.ceil()
    'ceil': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.ceil(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.cos()
    'cos': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.cos(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.cosh()
    'cosh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.cosh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.exp()
    'exp': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.exp(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.expm1()
    'expm1': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.expm1(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.floor()
    'floor': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.floor(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.hypot()
    'hypot': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.hypot(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.log()
    'log': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.log(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.log10()
    'log10': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.log10(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.log1p()
    'log1p': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.log1p(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.log2()
    'log2': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.log2(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.max()
    'max': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            const b = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(Math.max(a, b));
                return [s];
            }
            return [null];
        }
    },
    // Math.min()
    'min': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            const b = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(Math.min(a, b));
                return [s];
            }
            return [null];
        }
    },
    // Math.pow()
    'pow': {
        dt: '[[N N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            const b = toNumOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push(Math.pow(b, a));
                return [s];
            }
            return [null];
        }
    },
    // seedrandom
    'seedrandom': {
        dt: '[[N][] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                rng = new Prando(a);
                // rng_first = prng_alea(, {state: true});
                // SR.seedrandom(a.toString(10), { global: true });
                return [s];
            }
            return [null];
        }
    },
    // Math.random()
    'random': {
        dt: '[[][N] comp]',
        compose: s => {
            s.push(rng.next());
            return [s];
        }
    },
    // Math.sign()
    'sign': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.sign(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.sin()
    'sin': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.sin(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.sinh()
    'sinh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.sinh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.sqrt()
    'sqrt': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.sqrt(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.tan()
    'tan': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.tan(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.tanh()
    'tanh': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.tanh(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.trunc()
    'trunc': {
        dt: '[[N][N] comp]',
        compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.trunc(a));
                return [s];
            }
            return [null];
        }
    },
    'play': {
        dt: '[[F][F run] bind]',
        compose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        }
    },
    // binds names to stack values within one phrase of words
    'crouch': {
        dt: '[[[S+]F][F]]',
        compose: (s, pl) => {
            const words = toPLOrNull(s?.pop());
            const argList = toArrOfStrOrNull(s?.pop());
            if (words !== null && argList) {
                const values: Word[] = r.map(() => s?.pop(), argList);
                const localWD: { [index: string]: Word } =
                    r.zipObj(r.reverse(argList), values);
                const newWords: ProgramList =
                    toPLOrNull(subInWD(localWD, words));

                if (newWords) {
                    s.push(newWords);
                }
            }
            return [s, pl];
        }
    },
    'pounce': {
        dt: '[[[S+]F][F run]]',
        compose: (s, pl) => {
            const words = toPLOrNull(s?.pop());
            const argList = toArrOfStrOrNull(s?.pop());
            if (words !== null && argList) {
                const values: Word[] = r.map(() => s?.pop(), argList);
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
        dt: '[[A F][F run A] bind]',
        compose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            const item = s?.pop();
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
        dt: '[[A C F][F run A C] bind]',
        compose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            const item2 = s?.pop();
            pl = [item2].concat(pl);
            const item1 = s?.pop();
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
        dt: '[[C D E][E D C] bind]',
        compose: ['swap', ['swap'], 'dip', 'swap']
    },
    'rollup': {
        dt: '[[C D E][E C D] bind]',
        compose: ['swap', ['swap'], 'dip']
    },
    'rolldown': {
        dt: '[[C D E][D E C] bind]',
        compose: [['swap'], 'dip', 'swap']
    },
    'if-else': {
        dt: '[[B F F][F run] bind]',
        compose: (s, pl) => {
            const else_block = toPLOrNull(s?.pop());
            const then_block = toPLOrNull(s?.pop());
            const condition = toBoolOrNull(s?.pop());
            if (condition === null || then_block === null || else_block === null) {
                return [null];
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
        dt: '[[F G G][F run G G] bind [B F F] [F run] bind]',
        compose: [['play'], 'dip2', 'if-else']
    },
    '=': {
        dt: '[[N N][N B] comp]',
        compose: s => {
            const top = s?.pop();
            const b = toNumOrNull(top);
            const a = toNumOrNull(s[s.length - 1]);
            if (a !== null && b !== null) {
                s.push(a === b);
            }
            else {
                const c = toStringOrNull(top);
                const d = toStringOrNull(s[s.length - 1]);
                if (c !== null && d !== null) {
                    s.push(c === d);
                }
                else {
                    const e = toPLOrNull(top);
                    const f = toPLOrNull(s[s.length - 1]);
                    if (e !== null && f !== null) {
                        s.push(unparse(e) === unparse(f));
                    }
                    else {
                        s.push(false);
                    }
                }
            }
            return [s];
        }
    },
    '==': {
        dt: '[[N N][B] comp]',
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a === num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a === str_b);
                return [s];
            }
            const e = toPLOrNull(a);
            const f = toPLOrNull(b);
            if (e !== null && f !== null) {
                s.push(unparse(e) === unparse(f));
                return [s];
            }
            s.push(false);
            return [s];
        }
    },
    '!=': {
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a !== num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a !== str_b);
                return [s];
            }
            const e = toPLOrNull(a);
            const f = toPLOrNull(b);
            if (e !== null && f !== null) {
                s.push(unparse(e) !== unparse(f));
                return [s];
            }
            s.push(true);
            return [s];
        }
    },
    '>': {
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a > num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) > 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '<': {
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a < num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) < 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '>=': {
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a >= num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) >= 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '<=': {
        compose: s => {
            const b = s?.pop();
            const a = s?.pop();
            const num_b = toNumOrNull(b);
            const num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a <= num_b);
                return [s];
            }
            const str_b = toStringOrNull(b);
            const str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) <= 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    'concat': {
        dt: '[[[A*] [C*]][[A* C*]] bind]',
        compose: s => {
            const b = toArrOrNull(s?.pop());
            const a = toArrOrNull(s?.pop());
            if (a && b) {
                s.push([...a, ...b]);
            }
            return [s];
        }
    },
    'cons': {
        dt: '[[A [C*]][[A C*]] bind]',
        compose: s => {
            const b = toArrOrNull(s?.pop());
            const a = s?.pop();
            if (b) {
                s.push([a, ...b]);
            }
            return [s];
        }
    },
    'uncons': {
        dt: '[[[A+]][Af [Ar]] bind]',
        compose: s => {
            const arr = toArrOrNull(s?.pop());
            if (arr) {
                s.push(r.head(arr), r.tail(arr));
            }
            return [s];
        }
    },
    'push': {
        dt: '[[[A*] C][[A C]] bind]',
        compose: s => {
            const item = s?.pop();
            const arr = toArrOrNull(s?.pop());
            if (arr) {
                s.push([...arr, item]);
            }
            return [s];
        }
    },
    'pop': {
        dt: '[[[A+]][[Ab] Al] bind]',
        compose: s => {
            const arr = toArrOrNull(s?.pop());
            if (arr) {
                s.push(r.init(arr), r.last(arr));
            }
            return [s];
        }
    },
    'constrec': {
        dt: '[[F][G][H][I][J]] [J run H run F run...]',
        //     { type: 'initial extends (list<words>)' },
        //     { type: 'increment extends (list<words>)' },
        //     { type: 'condition extends (list<words>)' },
        //     { type: 'recurse extends (list<words>)' },
        //     { type: 'final extends (list<words>)' }
        // ], []],
        compose: (s, pl) => {
            // initial increment condition recurse final constrec
            const final = toPLOrNull(s?.pop());
            const recurse = toPLOrNull(s?.pop());
            const condition = toPLOrNull(s?.pop());
            const increment = toPLOrNull(s?.pop());
            const initial = toPLOrNull(s?.pop());
            if (initial && increment && condition && recurse && final) {
                const nextRec = [[], increment, condition, recurse, final, 'constrec'];
                pl = [...initial, ...increment, ...condition, [...recurse, ...nextRec], final, 'if-else'].concat(pl);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            return [s, pl];
        }
    },
    'linrec': {
        dt: '[[F][G][H][I]] [I run H [G run I H G F linrec F run] if-else]',
        //     { type: 'termTest extends (list<words>)' },
        //     { type: 'terminal extends (list<words>)' },
        //     { type: 'recurse extends (list<words>)' },
        //     { type: 'final extends (list<words>)' }
        // ], []],
        compose: (s, pl) => {
            // termtest && terminal && recurse && final linrec 
            const final = toPLOrNull(s?.pop());    // F
            const recurse = toPLOrNull(s?.pop());  // G
            const terminal = toPLOrNull(s?.pop()); // H
            const termtest = toPLOrNull(s?.pop()); // I
            if (termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'linrec', ...final];
                pl = [...termtest, terminal, [...recurse, ...nextRec], 'if-else'].concat(pl);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'linrec5': {
        dt: '[[F][G][H][I][J]] [J run H run F run...]',
        //     { type: 'init extends (list<words>)' },
        //     { type: 'termTest extends (list<words>)' },
        //     { type: 'terminal extends (list<words>)' },
        //     { type: 'recurse extends (list<words>)' },
        //     { type: 'final extends (list<words>)' }
        // ], []],
        compose: (s, pl) => {
            // termtest && terminal && recurse && final linrec 
            const final = toPLOrNull(s?.pop());
            const recurse = toPLOrNull(s?.pop());
            const terminal = toPLOrNull(s?.pop());
            const termtest = toPLOrNull(s?.pop());
            const init = toPLOrNull(s?.pop());
            if (init && termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'linrec', ...final];
                pl = [...init, ...termtest, terminal, [...recurse, ...nextRec], 'if-else'].concat(pl);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'binrec': {

        //     { type: 'termTest extends (list<words>)' },
        //     { type: 'terminal extends (list<words>)' },
        //     { type: 'recurse extends (list<words>)' },
        //     { type: 'final extends (list<words>)' }
        // ], []],
        compose: (s, pl) => {
            // termtest && terminal && recurse && final binrec 
            const final = toPLOrNull(s?.pop());
            const recurse = toPLOrNull(s?.pop());
            const terminal = toPLOrNull(s?.pop());
            const termtest = toPLOrNull(s?.pop());
            if (termtest && terminal && recurse && final) {
                const nextRec = [termtest, terminal, recurse, final, 'binrec'];
                pl = [...termtest, terminal, [...recurse, [...nextRec], 'dip', ...nextRec, ...final], 'if-else'].concat(pl);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'times': {
        dt: '[F N] [F run] bind',
        compose: ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'times'], ['drop', 'drop'], 'if-else']
    },
    'map': {
        dt: '[[A] F] [A F run [] cons] bind',
        compose: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["phrase", 'play'], 'dip', "swap", 'push'], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },
    'map2': {
        dt: '[[A] F] [A F run [] cons] bind',
        compose:
            [["list", "phrase"],
            [
                [[], "list"],
                ['size', 1, '<='],
                ['drop'],
                [
                    'uncons', 'uncons',
                    ['phrase', 'play', 'push'], 'dip'
                ],
                [], 'linrec5'
            ], "pounce"]
    },
    'filter': {

        // [{ type: 'valueList extends (list<words>)' },
        // { type: 'phrase extends (list<words>)' }],
        // [{ type: 'resultValueList extends (list<words>)' }]],
        compose: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["dup", "phrase", 'play'], 'dip', "rollup", ['push'], ['drop'], 'if-else'], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },
    'reduce': {

        // [{ type: 'valueList extends (list<words>)' },
        // { type: 'accumulater (word)' },
        // { type: 'phrase extends (list<words>)' }],
        // [{ type: 'resultValueList extends (list<words>)' }]],
        compose: [["list", "acc", "phrase"], [
            ["acc", "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["phrase", "play"], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },

    'split': {
        compose: [["cutVal", "theList", "operator"], [
            [], [], "cutVal", "theList",
            'size',
            ['uncons',
                ['dup2', "operator", "play",
                    ['swap', ['swap', ['push'], 'dip'], 'dip'],
                    ['swap', ['push'], 'dip'], 'if-else'], 'dip',
            ], 'swap', 'times', 'drop', 'swap', ['push'], 'dip'
        ], "pounce"]
    },
    'size': {
        compose: s => {
            const arr = toArrOrNull(s[s.length - 1]);
            if (arr) {
                s.push(arr.length);
            }
            return [s];
        }
    },
    'outAt': {
        compose: s => {
            const i = toNumOrNull(s?.pop());
            const arr = toArrOrNull(s[s.length - 1]);
            if (i !== null && arr && arr.length - 1 >= i) {
                s.push(arr[i]);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null]
            }
            return [s];
        }
    },
    'inAt': {
        compose: s => {
            const i = toNumOrNull(s?.pop());
            const ele = toWordOrNull(s?.pop());
            let arr: Word[] = toArrOrNull(s?.pop());
            if (i !== null && ele !== null && arr && arr.length - 1 >= i) {
                arr[i] = ele;
                s.push(arr);
            }
            else {
                console.error("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null]
            }
            return [s];
        }
    },

    'depth': {
        compose: s => {
            s.push(s.length);
            return [s];
        }
    },
    'stack-copy': {
        compose: s => {
            s.push([...s]);
            return [s];
        }
    },
    'popInternalCallStack': {
        compose: []
    },
    // // 'import': {
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const importable = toString(s?.pop());
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
    // // 's2int': {
    // //     expects: [{ desc: 'a number in a string', ofType: 'string' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s?.pop();
    // //         const str = toString(s?.pop());
    // //         s.push(Number.parseInt(str, radix));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'int2s': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s?.pop();
    // //         const n = s?.pop();
    // //         s.push(n.toString(radix));
    // //         return [s, pl];
    // //     }
    // // },
    // // '<<': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s?.pop();
    // //         const n = s?.pop();
    // //         s.push(n << shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // '>>': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s?.pop();
    // //         const n = s?.pop();
    // //         s.push(n >> shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'XOR': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s?.pop();
    // //         const n = s?.pop();
    // //         s.push(n ^ shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'AND': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s?.pop();
    // //         const n = s?.pop();
    // //         s.push(n & shift);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.set': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s?.pop());
    // //         localStorage.setItem(name, JSON.stringify(s?.pop()));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.get': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s?.pop());
    // //         s.push(JSON.parse(localStorage.getItem(name)));
    // //         return [s, pl];
    // //     }
    // // },
    // // 'store.remove': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s?.pop());
    // //         localStorage.removeItem(name);
    // //         return [s, pl];
    // //     }
    // // },
    'type-of': {
        compose: (s, pl) => {
            const item = s?.pop();
            const aNumber = toNumOrNull(item);
            if ((aNumber || aNumber === 0) && aNumber >= 0) {
                s.push("Nat");
                return [s];
            }
            if (aNumber && aNumber < 0) {
                s.push("Neg");
                return [s];
            }
            const aString = toStringOrNull(item);
            if (aString) {
                if (aString === "Nat" || aString === "Zero" || aString === "Str" || aString === "Neg") {
                    s.push("Type");
                }
                else if (aString === "Type") {
                    s.push("MetaType");
                }
                else {
                    s.push("Str");
                }
                return [s];
            }
            const aList = toArrOrNull(item);
            if (aList) {
                pl.unshift("map");
                pl.unshift(["type-of"]);
                pl.unshift(aList);
                return [s, pl];
            }
            return null;
        }
    },
    'is-a-type': {
        compose: (s, pl) => {
            const item = s?.pop();
            const aString = toStringOrNull(item);
            if (aString &&
                (aString === 'Str'
                    || aString === 'Nat'
                    || aString === 'Neg'
                    || aString === 'Zero'
                )) {
                s.push(true);
                return [s];
            }
            const aList = toArrOrNull(item);
            if (aList) {
                pl.unshift("map");
                pl.unshift(["is-a-type"]);
                pl.unshift(aList);
                return [s, pl];
            }
            s.push(false);
            return [s];
        }
    }

};

// function cloneItem(item: Word) {
//     // return cloneObject(item);
//     if (item !== undefined) {
//         return JSON.parse(JSON.stringify(item));
//     }
//     return item;
// }

const introspectWords = () => r.keys(r.omit(['popInternalCallStack'], coreWords));
const introspectWord = (wn: string) => JSON.parse(JSON.stringify(r.path([wn], coreWords)));
export const clone = <T>(source: T): T => {
    if (source === null) return source

    if (source instanceof Date) return new Date(source.getTime()) as any

    if (source instanceof Array) return source.map((item: any) => clone<any>(item)) as any

    if (typeof source === 'object' && source !== {}) {
        const clonnedObj = { ...(source as { [key: string]: any }) } as { [key: string]: any }
        Object.keys(clonnedObj).forEach(prop => {
            clonnedObj[prop] = clone<any>(clonnedObj[prop])
        })

        return clonnedObj as T
    }

    return source
}

// function deepClone<T extends object>(value: T): T {
//     if (typeof value !== 'object' || value === null) {
//       return value;
//     }

//     if (value instanceof Set) {
//       return new Set(Array.from(value, deepClone)) as T;
//     }

//     if (value instanceof Map) {
//       return new Map(Array.from(value, ([k, v]) => [k, deepClone(v)])) as T;
//     }

//     if (value instanceof Date) {
//       return new Date(value) as T;
//     }

//     if (value instanceof RegExp) {
//       return new RegExp(value.source, value.flags) as T;
//     }

//     return Object.keys(value).reduce((acc, key) => {
//       return Object.assign(acc, { [key]: deepClone(value[key]) });
//     }, (Array.isArray(value) ? [] : {}) as T);
//   }
