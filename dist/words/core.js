var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as r from "ramda";
import NP from 'number-precision';
import { introspectWords, introspectWord } from "../interpreter";
export var toNumOrNull = function (u) {
    return r.is(Number, u) ? u : null;
};
export var toArrOrNull = function (u) {
    return r.is(Array, u) ? u : null;
};
var toArrOfStrOrNull = function (u) {
    return r.is(Array, u) ? u : null;
};
export var toStringOrNull = function (u) {
    return r.is(String, u) ? u : null;
};
export var toPLOrNull = function (u) {
    return r.is(Array, u) ? u : null;
};
var toBoolOrNull = function (u) {
    return r.is(Boolean, u) ? u : null;
};
var toWordOrNull = function (u) {
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
};
// const toWordDictionaryOrNull = (u: any): WordDictionary | null =>
//     r.is(Object, u) ? u : null;
// const fetchProp = (wd: { [index: string]: Word }) => (w: Word, s: string | null) => {
//     const res = r.prop(s, wd);
//     if (!res) {
//         return res;
//     }
//     return w;
// };
var consReslover = function (localWD) { return function (w) {
    if (r.is(String, w)) {
        var newW = toWordOrNull(r.propOr(w, w, localWD));
        return newW !== null ? newW : w;
    }
    var subList = toPLOrNull(w);
    if (r.is(Array, subList)) {
        return subInWD(localWD, __spreadArrays(subList));
    }
    return w;
}; };
var subInWD = function (localWD, words) {
    var resolveWord = consReslover(localWD);
    return r.map(resolveWord, words);
};
export var coreWords = {
    'words': {
        sig: [[], [{ type: 'list' }]],
        compose: function (s) {
            s.push(introspectWords());
            return [s];
        }
    },
    // introspectWord
    'word': {
        sig: [[{ type: ['A'] }], [{ type: 'record' }]],
        compose: function (s) {
            var phrase = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var wordName = toStringOrNull(phrase[0]);
            if (wordName) {
                s.push(introspectWord(wordName));
                return [s];
            }
            return [null];
        }
    },
    'dup': {
        sig: [[{ type: 'A', use: 'observe' }], [{ type: 'A' }]],
        compose: function (s) { s.push(s[s.length - 1]); return [s]; }
    },
    //    'dup': s => { s.push(JSON.parse(JSON.stringify(s[s.length - 1]))); return [s]; },
    'swap': {
        sig: [[{ type: 'A' }, { type: 'B' }], [{ type: 'B' }, { type: 'A' }]],
        compose: function (s) {
            var top = s === null || s === void 0 ? void 0 : s.pop();
            var under = s === null || s === void 0 ? void 0 : s.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': {
        sig: [[{ type: 'any' }], []],
        compose: function (s) { s === null || s === void 0 ? void 0 : s.pop(); return [s]; }
    },
    'round': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), '(int | float)');
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(NP.round(a, b));
                return [s];
            }
            return [null];
        }
    },
    '+': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), '(int | float)');
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(NP.plus(a, b));
                return [s];
            }
            return [null];
        }
    },
    '-': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(NP.minus(a, b));
                return [s];
            }
            return [null];
        }
    },
    '/': {
        sig: [[{ type: 'number' }, { type: 'number', gaurd: [0, '!='] }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(NP.divide(a, b));
                return [s];
            }
            return [null];
        }
    },
    '%': {
        sig: [[{ type: 'number' }, { type: 'number', gaurd: [0, '!='] }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(a % b);
                return [s];
            }
            return [null];
        }
    },
    '*': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(NP.times(a, b));
                return [s];
            }
            return [null];
        }
    },
    // bitwise on integers
    '&': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a & b);
                return [s];
            }
            return [null];
        }
    },
    '|': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a | b);
                return [s];
            }
            return [null];
        }
    },
    '^': {
        sig: [[{ type: 'number' }, { type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a ^ b);
                return [s];
            }
            return [null];
        }
    },
    '~': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null) {
                s.push(~a);
                return [s];
            }
            return [null];
        }
    },
    '&&': {
        sig: [[{ type: 'boolean' }, { type: 'boolean' }], [{ type: 'boolean' }]],
        compose: function (s) {
            var b = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a && b);
                return [s];
            }
            return [null];
        }
    },
    '||': {
        sig: [[{ type: 'boolean' }, { type: 'boolean' }], [{ type: 'boolean' }]],
        compose: function (s) {
            var b = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a || b);
                return [s];
            }
            return [null];
        }
    },
    '!': {
        sig: [[{ type: 'boolean' }], [{ type: 'boolean' }]],
        compose: function (s) {
            var a = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            s.push(Math.E);
            return [s];
        }
    },
    // Math.LN10
    'LN10': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.LN10);
            return [s];
        }
    },
    // Math.LN2
    'LN2': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.LN2);
            return [s];
        }
    },
    // Math.LOG10E
    'LOG10E': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.LOG10E);
            return [s];
        }
    },
    // Math.LOG2E
    'LOG2E': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.LOG2E);
            return [s];
        }
    },
    // Math.PI
    'PI': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.PI);
            return [s];
        }
    },
    // Math.SQRT1_2
    'SQRT1_2': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.SQRT1_2);
            return [s];
        }
    },
    // Math.SQRT2
    'SQRT2': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.SQRT2);
            return [s];
        }
    },
    // Math.abs()
    'abs': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(Math.pow(b, a));
                return [s];
            }
            return [null];
        }
    },
    // Math.random()
    'random': {
        sig: [[], [{ type: 'number' }]],
        compose: function (s) {
            s.push(Math.random());
            return [s];
        }
    },
    // Math.sign()
    'sign': {
        sig: [[{ type: 'number' }], [{ type: 'number' }]],
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null) {
                s.push(Math.trunc(a));
                return [s];
            }
            return [null];
        }
    },
    'play': {
        sig: [[{ type: 'P extends (list<words>)', use: 'run!' }], [{ type: 'result(P)' }]],
        compose: function (s, pl) {
            var block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        sig: [[{ type: 'Args extends (list<string>)', use: 'pop-each!' }, { type: 'P extends (list<words>)', use: 'run!' }], [{ type: 'result(P)' }]],
        compose: function (s, pl) {
            var words = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var argList = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (words !== null && argList) {
                var values = r.map(function () { return s === null || s === void 0 ? void 0 : s.pop(); }, argList);
                var localWD = r.zipObj(r.reverse(argList), values);
                var newWords = toPLOrNull(subInWD(localWD, words));
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
        sig: [[{ type: 'A' }, { type: ['*'], use: 'run' }], [{ type: '*-result-types' }, { type: 'A' }]],
        compose: function (s, pl) {
            var block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var item = s === null || s === void 0 ? void 0 : s.pop();
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
        compose: function (s, pl) {
            var block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var item2 = s === null || s === void 0 ? void 0 : s.pop();
            pl = [item2].concat(pl);
            var item1 = s === null || s === void 0 ? void 0 : s.pop();
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
        compose: ['swap', ['swap'], 'dip', 'swap']
    },
    'rollup': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'C' }, { type: 'A' }, { type: 'B' }]],
        compose: ['swap', ['swap'], 'dip']
    },
    'rolldown': {
        sig: [[{ type: 'A' }, { type: 'B' }, { type: 'C' }], [{ type: 'B' }, { type: 'C' }, { type: 'A' }]],
        compose: [['swap'], 'dip', 'swap']
    },
    'if-else': {
        compose: function (s, pl) {
            var else_block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var then_block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var condition = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        // expects: [{ desc: 'conditional', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally play the first or second quotation',
        compose: [['play'], 'dip2', 'if-else']
    },
    '=': {
        sig: [[{ type: 'A', use: 'observe' }, { type: 'A' }], [{ type: 'boolean' }]],
        compose: function (s) {
            var top = s === null || s === void 0 ? void 0 : s.pop();
            var b = toNumOrNull(top);
            var a = toNumOrNull(s[s.length - 1]);
            if (a !== null && b !== null) {
                s.push(a === b);
            }
            else {
                var c = toStringOrNull(top);
                var d = toStringOrNull(s[s.length - 1]);
                if (c !== null && d !== null) {
                    s.push(c === d);
                }
            }
            return [s];
        }
    },
    '==': {
        sig: [[{ type: 'A' }, { type: 'A' }], [{ type: 'boolean' }]],
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a === num_b);
            }
            else {
                var str_b = toStringOrNull(b);
                var str_a = toStringOrNull(a);
                if (str_a !== null && str_b !== null) {
                    s.push(str_a === str_b);
                }
            }
            return [s];
        }
    },
    '!=': {
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a !== b);
            }
            return [s];
        }
    },
    '>': {
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a > b);
            }
            return [s];
        }
    },
    '<': {
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a < b);
            }
            return [s];
        }
    },
    '>=': {
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a >= b);
            }
            return [s];
        }
    },
    '<=': {
        compose: function (s) {
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a !== null && b !== null) {
                s.push(a <= b);
            }
            return [s];
        }
    },
    'concat': {
        compose: function (s) {
            var b = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (a && b) {
                s.push(__spreadArrays(a, b));
            }
            return [s];
        }
    },
    'cons': {
        sig: [[{ type: 'A' }, { type: ['*'] }], [{ type: ['A', '*'] }]],
        compose: function (s) {
            var b = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var a = s === null || s === void 0 ? void 0 : s.pop();
            if (b) {
                s.push(__spreadArrays([a], b));
            }
            return [s];
        }
    },
    'uncons': {
        sig: [[{ type: ['A', '*'] }], [{ type: 'A' }, { type: ['*'] }]],
        compose: function (s) {
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (arr) {
                s.push(r.head(arr), r.tail(arr));
            }
            return [s];
        }
    },
    'push': {
        sig: [[{ type: ['*'] }, { type: 'A' }], [{ type: ['*', 'A'] }]],
        compose: function (s) {
            var item = s === null || s === void 0 ? void 0 : s.pop();
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (arr) {
                s.push(__spreadArrays(arr, [item]));
            }
            return [s];
        }
    },
    'pop': {
        sig: [[{ type: ['*', 'A'] }], [{ type: ['*'] }, { type: 'A' }]],
        compose: function (s) {
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s, pl) {
            // initial increment condition recurse final constrec
            var final = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var recurse = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var condition = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var increment = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var initial = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (initial && increment && condition && recurse && final) {
                var nextRec = [[], increment, condition, recurse, final, 'constrec'];
                pl = __spreadArrays(initial, increment, condition, [__spreadArrays(recurse, nextRec), final, 'if-else']).concat(pl);
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
        compose: function (s, pl) {
            // termtest && terminal && recurse && final linrec 
            var final = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var recurse = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var terminal = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var termtest = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (termtest && terminal && recurse && final) {
                var nextRec = __spreadArrays([termtest, terminal, recurse, final, 'linrec'], final);
                pl = __spreadArrays(termtest, [terminal, __spreadArrays(recurse, nextRec), 'if-else']).concat(pl);
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
        compose: function (s, pl) {
            // termtest && terminal && recurse && final linrec 
            var final = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var recurse = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var terminal = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var termtest = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var init = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (init && termtest && terminal && recurse && final) {
                var nextRec = __spreadArrays([termtest, terminal, recurse, final, 'linrec'], final);
                pl = __spreadArrays(init, termtest, [terminal, __spreadArrays(recurse, nextRec), 'if-else']).concat(pl);
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
        compose: function (s, pl) {
            // termtest && terminal && recurse && final binrec 
            var final = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var recurse = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var terminal = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var termtest = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (termtest && terminal && recurse && final) {
                var nextRec = [termtest, terminal, recurse, final, 'binrec'];
                pl = __spreadArrays(termtest, [terminal, __spreadArrays(recurse, [__spreadArrays(nextRec), 'dip'], nextRec, final), 'if-else']).concat(pl);
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
        compose: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    },
    'times': {
        sig: [[{ type: 'P extends (list<words>)', use: 'runs' }, { type: 'int as n' }], [{ type: 'P n times' }]],
        compose: ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'times'], ['drop', 'drop'], 'if-else']
    },
    'map': {
        sig: [
            [{ type: 'ValueList extends (list<words>)' },
                { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]
        ],
        compose: [["list", "phrase"], [
                [[], "list"],
                ['size', 0, '<='],
                ['drop'],
                ['uncons', ["swap", ["phrase", 'play'], 'dip', "swap", 'push'], 'dip'],
                [], 'linrec5'
            ], "pounce"]
    },
    'filter': {
        sig: [
            [{ type: 'ValueList extends (list<words>)' },
                { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]
        ],
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
            [{ type: 'ValueList extends (list<words>)' },
                { type: 'Accumulater (word)' },
                { type: 'Phrase extends (list<words>)' }],
            [{ type: 'ResultValueList extends (list<words>)' }]
        ],
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
        compose: function (s) {
            var arr = toArrOrNull(s[s.length - 1]);
            if (arr) {
                s.push(arr.length);
            }
            return [s];
        }
    },
    'depth': {
        compose: function (s) {
            s.push(s.length);
            return [s];
        }
    },
    'stack-copy': {
        compose: function (s) {
            s.push(__spreadArrays(s));
            return [s];
        }
    },
    'popInternalCallStack': {
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