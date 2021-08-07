import * as r from "ramda";
import { WordDictionary } from "../WordDictionary.types";
import { ProgramList, Word } from '../types';
import NP from 'number-precision';
import { unParser as unparse } from "../parser/Pinna";
import Prando from 'prando';
let rng: { next: () => number };

const toNumTypeOrNull = (u: any): number | null =>
    r.is(Number, u) || u === "number_t" ? u : null;
const toBoolTypeOrNull = (u: any): boolean | null =>
    r.is(Boolean, u) || u === "boolean_t" ? u : null;

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
        typeCompose: "compose",
		compose: (s) => {
            s.push(introspectWords());
            return [s];
        }
    },
    // introspectWord
    'word': {
        sig: [[{ type: 'list<string>)' }], [{ type: 'record' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A', use: 'observe' }], [{ type: 'A', use: 'observe' }, { type: 'A' }]],
        typeCompose: // "compose", 
        (s, pl) => {
            const a = s?.pop();
            if (a !== undefined) {
                // * // console.log("'dup' compose known type ", a);
                s.push(a, a);
                return [s];
            }
            // * // console.log("'dup' compose virtual type ");
            s.push("-any_t A", "A", "A");
            return [s];
        },
		compose: s => { s.push(clone(s[s.length - 1])); return [s]; }
        // s => { s.push(s[s.length - 1]); return [s]; }
    },
    'dup2': {
        sig: [[{ type: 'A', use: 'observe' }, { type: 'B', use: 'observe' }], [{ type: 'A' }, { type: 'B' }, { type: 'A' }, { type: 'B' }]],
        typeCompose: "compose",
		compose: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    },
    'swap': {
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'B' }, { type: 'A' }]],
        typeCompose: s => {
            const top = s?.pop();
            const under = s?.pop();
            if (top === undefined && under === undefined) {
                // * // console.log("'swap' virtual types");
                s.push("-any_t A");
                s.push("-any_t B");
                s.push("A");
                s.push("B");
            }
            else if (under === undefined) {
                // * // console.log("'swap' one known type", top);
                s.push(top);
                s.push("-any_t A");
                s.push("A");
            }
            else {
                // * // console.log("'swap' known types", top, under);
                s.push(top);
                s.push(under);
            }
            return [s];
        },
		compose: s => {
            const top = s?.pop();
            const under = s?.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': {
        sig: [[{ type: 'A' }], []],
        typeCompose: s => { 
            const a = s?.pop();
            if (a === undefined) {
                // * // console.log("'drop' virtual type");
                s.push("-any_t");
            } 
            // * // console.log("'drop' concrete type", a);
            return [s];
        },
		compose: s => { s?.pop(); return [s]; }
    },
    'round': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        typeCompose: s => {
            const b = toNumTypeOrNull(s?.pop());
            const a = toNumTypeOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push("number_t");
                return [s];
            }
            if (b !== null) {
                s.push("-number_t");
                s.push("number_t");
                return [s];
            }
            s.push("-number_t");
            s.push("-number_t");
            s.push("number_t");
            return [s];
        },
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
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
		typeCompose:  s => {
            const b = toNumTypeOrNull(s?.pop());
            const a = toNumTypeOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push("number_t");
                return [s];
            }
            if (b !== null) {
                s.push("-number_t");
                s.push("number_t");
                return [s];
            }
            s.push("-number_t");
            s.push("-number_t");
            s.push("number_t");
            return [s];
        },
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
        sig: [[{ type: 'number' }, { type: 'number', guard: [0, '!='] }], [{ type: 'number' }]],
        typeCompose:  s => {
            const b = toNumTypeOrNull(s?.pop());
            const a = toNumTypeOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push("number_t");
                return [s];
            }
            if (b !== null) {
                s.push("-number_t");
                s.push("number_t");
                return [s];
            }
            s.push("-number_t");
            s.push("-number_t");
            s.push("number_t");
            return [s];
        },
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
        sig: [[{ type: 'number' }, { type: 'number', guard: [0, '!='] }], [{ type: 'number' }]],
        typeCompose:  s => {
            const b = toNumTypeOrNull(s?.pop());
            const a = toNumTypeOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push("number_t");
                return [s];
            }
            if (b !== null) {
                s.push("-number_t");
                s.push("number_t");
                return [s];
            }
            s.push("-number_t");
            s.push("-number_t");
            s.push("number_t");
            return [s];
        },
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
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        typeCompose:  s => {
            const b = toNumTypeOrNull(s?.pop());
            const a = toNumTypeOrNull(s?.pop());
            if (a !== null && b !== null) {
                s.push("number_t");
                return [s];
            }
            if (b !== null) {
                s.push("-number_t");
                s.push("number_t");
                return [s];
            }
            s.push("-number_t");
            s.push("-number_t");
            s.push("number_t");
            return [s];
        },
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
        sig: [[{ type: 'int' }, { type: 'int' }], [{ type: 'int' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'int' }, { type: 'int' }], [{ type: 'int' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'int' }, { type: 'int' }], [{ type: 'int' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'int' }], [{ type: 'int' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'boolean' }, { type: 'boolean' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'boolean' }, { type: 'boolean' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'boolean' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.E);
            return [s];
        }
    },
    // Math.LN10
    'LN10': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.LN10);
            return [s];
        }
    },
    // Math.LN2
    'LN2': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.LN2);
            return [s];
        }
    },
    // Math.LOG10E
    'LOG10E': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.LOG10E);
            return [s];
        }
    },
    // Math.LOG2E
    'LOG2E': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.LOG2E);
            return [s];
        }
    },
    // Math.PI
    'PI': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.PI);
            return [s];
        }
    },
    // Math.SQRT1_2
    'SQRT1_2': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.SQRT1_2);
            return [s];
        }
    },
    // Math.SQRT2
    'SQRT2': {
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(Math.SQRT2);
            return [s];
        }
    },
    // Math.abs()
    'abs': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.max(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.min()
    'min': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            const a = toNumOrNull(s?.pop());
            if (a !== null) {
                s.push(Math.min(a));
                return [s];
            }
            return [null];
        }
    },
    // Math.pow()
    'pow': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], []],
        typeCompose: "compose",
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
        sig: [[], [{ type: 'number' }]],
        typeCompose: "compose",
		compose: s => {
            s.push(rng.next());
            return [s];
        }
    },
    // Math.sign()
    'sign': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A', use: 'run!' }], [{ type: "A", use: 'run'}]],
        typeCompose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            if (block !== null) {
                // * // console.log("'play' compose known type ", block);
                pl = block.concat(pl);
            }
            else {
                // * // console.log("'play' compose virtyal type ", block);
                pl.unshift(block);
            }
            return [s, pl];
        },
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
    'pounce': {
        sig: [[{ type: 'list<string>', use: 'pop-each!' }, { type: 'P', use: 'run!' }], [{ type: 'runOf P' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A' }, { type: 'P', use: 'run!' }], [{ type: 'runOf P' }, { type: 'A' }]],
        typeCompose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            const item = s?.pop();
            // * // console.log("typeCompose dip", block, item);
            pl = [item].concat(pl);
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        },
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
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'P', use: 'run!' }], [{ type: 'runOf P' }, { type: 'A' }, { type: 'B' }]],
        typeCompose: (s, pl) => {
            const block = toPLOrNull(s?.pop());
            const item1 = s?.pop();
            const item2 = s?.pop();
            // * // console.log("typeCompose dip", block, item);
            pl = [item2, item1].concat(pl);
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        },
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
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'C' }, { type: 'B' }, { type: 'A' }]],
        typeCompose: "compose",
		compose: ['swap', ['swap'], 'dip', 'swap']
    },
    'rollup': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'C' }, { type: 'A' }, { type: 'B' }]],
        typeCompose: "compose",
		compose: ['swap', ['swap'], 'dip']
    },
    'rolldown': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'B' }, { type: 'C' }, { type: 'A' }]],
        typeCompose: "compose",
		compose: [['swap'], 'dip', 'swap']
    },
    'if-else': {
        sig: [[{ type: 'boolean' }, { type: 'A', use: "run!" }, { type: 'A', use: 'run!' }], [{ type: 'A' }]],
        typeCompose: (s, pl) => {
            const else_block = toPLOrNull(s?.pop());
            const then_block = toPLOrNull(s?.pop());
            const condition = toBoolTypeOrNull(s?.pop());
            if (condition === null && then_block === null && else_block === null) {
                s.push("-boolean_t", "-any_t A", "-any_t A", "A");
                return [s];
            }
            if (condition === null && then_block === null && else_block !== null) {
                s.push("-boolean_t", "-any_t A", else_block);
                pl.unshift("play");
                return [s];
            }
            if (condition === null && then_block !== null && else_block !== null) {
                s.push("-boolean_t", then_block );
                pl.unshift("play");
                return [s];
            }
            if (condition !== null && then_block !== null && else_block !== null) {
                s.push( then_block );
                pl.unshift("play");
                return [s];
            }
            return [s, pl];
        },
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
        typeCompose: "compose",
		compose: [['play'], 'dip2', 'if-else']
    },
    '=': {
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'A' }, { type: 'boolean' }]],
        typeCompose: s => {
            const a = s?.pop();
            const b = s?.pop();
            if (a === undefined && b === undefined) {
                // * // console.log("'=' virtual types");
                s.push("-any_t A");
                s.push("-any_t");
                s.push("A");
                s.push("boolean_t");
            }
            else if (b === undefined) {
                // * // console.log("'=' one known type", a);
                s.push(a);
                s.push("-any_t");
                s.push("boolean_t");
            }
            else {
                // * // console.log("'=' two known types", a, b);
                s.push(a);
                s.push("boolean_t");
            }
            return [s];
        },
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: s => {
            const a = s?.pop();
            const b = s?.pop();
            if (a === undefined && b === undefined) {
                // * // console.log("'==' virtual types");
                s.push("-any_t");
                s.push("-any_t");
                s.push("boolean_t");
            }
            else if (b === undefined) {
                // * // console.log("'==' one known type", a);
                s.push("-any_t");
                s.push("boolean_t");
            }
            else {
                // * // console.log("'==' two known types", a, b);
                s.push("boolean_t");
            }
            return [s];
        },
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'boolean' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'list' }, { type: 'list' }], [{ type: 'list' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'any' }, { type: 'list' }], [{ type: 'list' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'list' }], [{ type: 'any' }, { type: 'list' }]],
        typeCompose: "compose",
		compose: s => {
            const arr = toArrOrNull(s?.pop());
            if (arr) {
                s.push(r.head(arr), r.tail(arr));
            }
            return [s];
        }
    },
    'push': {
        sig: [[{ type: 'list' }], [{ type: 'any' }, { type: 'list' }]],
        typeCompose: "compose",
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
        sig: [[{ type: 'list' }], [{ type: 'list' }, { type: 'any' }]],
        typeCompose: "compose",
		compose: s => {
            const arr = toArrOrNull(s?.pop());
            if (arr) {
                s.push(r.init(arr), r.last(arr));
            }
            return [s];
        }
    },
    'constrec': {
        sig: [[
            { type: 'initial extends (list<words>)' },
            { type: 'increment extends (list<words>)' },
            { type: 'condition extends (list<words>)' },
            { type: 'recurse extends (list<words>)' },
            { type: 'final extends (list<words>)' }
        ], []],
        typeCompose: "compose",
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
                // throw new Error("stack value(s) not found");
            }
            return [s, pl];
        }
    },
    'linrec': {
        sig: [[
            { type: 'termTest extends (list<words>)' },
            { type: 'terminal extends (list<words>)' },
            { type: 'recurse extends (list<words>)' },
            { type: 'final extends (list<words>)' }
        ], []],
        typeCompose: "compose",
		compose: (s, pl) => {
            // termtest && terminal && recurse && final linrec 
            const final = toPLOrNull(s?.pop());
            const recurse = toPLOrNull(s?.pop());
            const terminal = toPLOrNull(s?.pop());
            const termtest = toPLOrNull(s?.pop());
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
            { type: 'init extends (list<words>)' },
            { type: 'termTest extends (list<words>)' },
            { type: 'terminal extends (list<words>)' },
            { type: 'recurse extends (list<words>)' },
            { type: 'final extends (list<words>)' }
        ], []],
        typeCompose: "compose",
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
                console.log("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'binrec': {
        sig: [[
            { type: 'termTest extends (list<words>)' },
            { type: 'terminal extends (list<words>)' },
            { type: 'recurse extends (list<words>)' },
            { type: 'final extends (list<words>)' }
        ], []],
        typeCompose: "compose",
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
                console.log("some stack value(s) not found");
                // throw new Error("stack value(s) not found");
            }
            // console.log('*** s pl ***', s, pl);
            return [s, pl];
        }
    },
    'times': {
        sig: [[{ type: 'P extends (list<words>)', use: 'runs' }, { type: 'int as n' }], [{ type: 'P n times' }]],
        typeCompose: "compose",
		compose: ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'times'], ['drop', 'drop'], 'if-else']
    },
    'map': {
        sig: [
            [{ type: 'valueList extends (list<words>)' },
            { type: 'phrase extends (list<words>)' }],
            [{ type: 'resultValueList extends (list<words>)' }]],
        typeCompose: "compose",
		compose: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["phrase", 'play'], 'dip', "swap", 'push'], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },
    'map2': {
        sig: [
            [{ type: 'valueList extends (list<words>)' },
            { type: 'phrase extends (list<words>)' }],
            [{ type: 'resultValueList extends (list<words>)' }]],
        typeCompose: "compose",
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
        sig: [
            [{ type: 'valueList extends (list<words>)' },
            { type: 'phrase extends (list<words>)' }],
            [{ type: 'resultValueList extends (list<words>)' }]],
        typeCompose: "compose",
		compose: [["list", "phrase"], [
            [[], "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["swap", ["dup", "phrase", 'play'], 'dip', "rollup", ['push'], ['drop'], 'if-else'], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },
    'reduce': {
        sig: [
            [{ type: 'valueList extends (list<words>)' },
            { type: 'accumulater (word)' },
            { type: 'phrase extends (list<words>)' }],
            [{ type: 'resultValueList extends (list<words>)' }]],
        typeCompose: "compose",
		compose: [["list", "acc", "phrase"], [
            ["acc", "list"],
            ['size', 0, '<='],
            ['drop'],
            ['uncons', ["phrase", "play"], 'dip'],
            [], 'linrec5'
        ], "pounce"]
    },

    'split': {
        sig: [[{type:"any"}, {type:"list"}, {type:"[{type:boolean}]"}], [{type:"list"}, {type:"list"}]],
        typeCompose: "compose",
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
        sig: [[{type:"list"}], [{type:"list"}, {type:"number"}]],
        typeCompose: "compose",
		compose: s => {
            const arr = toArrOrNull(s[s.length - 1]);
            if (arr) {
                s.push(arr.length);
            }
            return [s];
        }
    },
    'outAt': {
        typeCompose: "compose",
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
        typeCompose: "compose",
		compose: s => {
            const i = toNumOrNull(s?.pop());
            const ele = toWordOrNull(s?.pop());
            let arr: Word[] = toArrOrNull(s?.pop());
            if (i !== null && ele && arr && arr.length - 1 >= i) {
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
        typeCompose: "compose",
		compose: s => {
            s.push(s.length);
            return [s];
        }
    },
    'stack-copy': {
        typeCompose: "compose",
		compose: s => {
            s.push([...s]);
            return [s];
        }
    },
    'popInternalCallStack': {
        typeCompose: "compose",
		compose: []
    }
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
    // // 'abs': {
    // //     definition: function (s: Json[]) {
    // //         const n = s?.pop();
    // //         s.push(Math.abs(n));
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
    // //         const b = toBoolean(s?.pop());
    // //         const a = toBoolean(s?.pop());
    // //         s.push(a && b);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'or': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical or',
    // //     definition: function (s: Json[]) {
    // //         const b = toBoolean(s?.pop());
    // //         const a = toBoolean(s?.pop());
    // //         s.push(a || b);
    // //         return [s, pl];
    // //     }
    // // },
    // // 'not': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }], effects: [0], tests: [], desc: 'logical not',
    // //     definition: function (s: Json[]) {
    // //         const a = toBoolean(s?.pop());
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
    // //     expects: [{ desc: 'key', ofType: 'word' }, { desc: 'a', ofType: 'record' }], effects: [-2], tests: [], desc: 'play a matching case',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const case_record = s?.pop();
    // //         let key = s?.pop();
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
    // //             ["rotate", "pop", "rolldown", ["dup"], "dip", "dup", ["play"], "dip", "swap",
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
    // //         'reduce-step': [['pop'], 'dip2', 'dup', [['swap'], 'dip', 'play'], 'dip'],
    // //         'teardown-reduce': ['drop', ['drop'], 'dip'],
    // //     },
    // //     'definition': ['process-reduce', 'teardown-reduce']
    // // }

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
const clone = <T>(source: T): T => {
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