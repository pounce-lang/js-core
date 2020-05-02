'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var r = require('ramda');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var toNumOrNull = function (u) {
    return r.is(Number, u) ? u : null;
};
var toArrOrNull = function (u) {
    return r.is(Array, u) ? u : null;
};
var toStringOrNull = function (u) {
    return r.is(String, u) ? u : null;
};
var toPLOrNull = function (u) {
    return r.is(Array, u) ? u : null;
};
var toBoolOrNull = function (u) {
    return r.is(Boolean, u) ? u : null;
};
var toWordDictionaryOrNull = function (u) {
    return r.is(Object, u) ? u : null;
};
var coreWords = {
    'dup': {
        def: function (s) { s.push(s[s.length - 1]); return [s]; }
    },
    //    'dup': s => { s.push(JSON.parse(JSON.stringify(s[s.length - 1]))); return [s]; },
    'pop': {
        def: function (s) {
            var arr = toArrOrNull(s[s.length - 1]);
            s.push(arr ? arr.pop() : null);
            return [s];
        }
    },
    'swap': {
        def: function (s) {
            var top = s.pop();
            var under = s.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': { def: function (s) { s.pop(); return [s]; } },
    '+': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a + b);
                return [s];
            }
            return null;
        }
    },
    '-': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a - b);
                return [s];
            }
            return null;
        }
    },
    '/': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(a / b);
                return [s];
            }
            return null;
        }
    },
    '%': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            if (a !== null && b !== null && b !== 0) {
                s.push(a % b);
                return [s];
            }
            return null;
        }
    },
    '*': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            if (a !== null && b !== null) {
                s.push(a * b);
                return [s];
            }
            return null;
        }
    },
    'apply': {
        sig: [{ type: 'list<words>', use: 'run!' }],
        def: function (s, pl) {
            var block = toPLOrNull(s.pop());
            if (block) {
                pl = block.concat(pl);
            }
            else {
                pl.unshift(block);
            }
            return [s, pl];
        }
    },
    // // // // 'local-env-stack': [], // as WordDictionary[],
    // // // // 'add-local-env': {
    // // // //     sig: [],
    // // // //     def: (s, pl, wd) => {
    // // // //         const localStack: WordDictionary[] = toArrOrNull(wd['local-env-stack']);
    // // // //         if (localStack) {
    // // // //             localStack.push({});
    // // // //         }
    // // // //         return [s, pl, wd];
    // // // //     }
    // // // // },
    // // // // 'drop-local-env': {
    // // // //     sig: [{ type: 'string', use: 'consume' }],
    // // // //     def: (s, pl, wd) => {
    // // // //         const key = s.pop().toString();
    // // // //         delete wd[key];
    // // // //         return [s, pl, wd];
    // // // //     }
    // // // // },
    // // // // 'apply-with': {
    // // // //     sig: [{ type: 'list<keys>', use: 'consume' }, { type: 'list<words>', use: 'run!' }],
    // // // //     def: (s, pl) => {
    // // // //         const block = toPLOrNull(s.pop());
    // // // //         //        const argList = toPLOrNull(s.pop());
    // // // //         if (block !== null) {
    // // // //             // pl = ["add-local", ["pop", "swap", [[], "cons", "def-local"]], "map", "dip2", [...block], "apply", "drop-local", ...pl];
    // // // //             //                pl = ["add-local-env", ["pop", "swap", [[], "cons", "def-local"]], "map", "dip2", ...block, "drop-local-env", ...pl];
    // // // //             pl = ["add-local-env", "rollup", ["pop", "swap", [[], "cons", "def-local"]], "map", "dip2", ...block, "drop-local-env", ...pl];
    // // // //         }
    // // // //         else {
    // // // //             // pl.unshift(block);
    // // // //         }
    // // // //         return [s, pl];
    // // // //     }
    // // // //     // list_module import
    // // // //     // 1 10 20 [a b] [a + b *]
    // // // //     //  [code12] [top-env] def
    // // // //     // swap pop [] cons rotate [
    // // // //     // #top-env swap cons
    // // // //     //  [[] cons] dip def] dip2 
    // // // //     // swap pop [] cons rotate [[[] cons] dip def] dip2 
    // // // //     // [drop] dip
    // // // //     // apply
    // // // // },
    'dip': {
        def: function (s, pl) {
            var block = toPLOrNull(s.pop());
            var item = s.pop();
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
        def: function (s, pl) {
            var block = toPLOrNull(s.pop());
            var item2 = s.pop();
            pl = [item2].concat(pl);
            var item1 = s.pop();
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
        def: ['swap', ['swap'], 'dip', 'swap']
    },
    'if-else': {
        def: function (s, pl) {
            var else_block = toPLOrNull(s.pop());
            var then_block = toPLOrNull(s.pop());
            var condition = toBoolOrNull(s.pop());
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
    '==': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a === b);
            return [s];
        }
    },
    '!=': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a !== b);
            return [s];
        }
    },
    '>': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a > b);
            return [s];
        }
    },
    '<': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a < b);
            return [s];
        }
    },
    '>=': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a >= b);
            return [s];
        }
    },
    '<=': {
        def: function (s) {
            var b = toNumOrNull(s.pop());
            var a = toNumOrNull(s.pop());
            s.push(a <= b);
            return [s];
        }
    },
    'dup2': { def: [['dup'], 'dip', 'dup', ['swap'], 'dip'] },
    'times': { def: ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'times'], ['drop', 'drop'], 'if-else'] },
    // note: 'def' has been moved to the preprocessing phase
    'def-local': {
        sig: [{ type: 'number', use: 'observe' }, { type: 'list<words>', use: 'consume' }, { type: 'list<string>', use: 'consume' }],
        def: function (s, pl, wd) {
            var key = toPLOrNull(s.pop());
            var definition = toPLOrNull(s.pop());
            var localWdKey = toNumOrNull(s[s.length - 1]).toString();
            var localWD = toWordDictionaryOrNull(wd[localWdKey]);
            if (key && typeof key[0] === 'string' && definition && localWD) {
                localWD[key[0]] = { def: definition };
            }
            return [s, pl, wd];
        }
    },
};

var pinnaParser = function () {
    var parser_actions = {
        make_pounce_empty: function () {
            return [];
        },
        make_pounce_pl: function (input, start, end, elements) {
            var list = [elements[1]];
            elements[2].forEach(function (el) { list.push(el.value); });
            return list;
        },
        make_word: function (input, start, end, elements) {
            return input.substring(start, end);
        },
        make_map: function (input, start, end, elements) {
            var map = {};
            if (elements.length = 6) {
                map[elements[2][0]] = elements[2][1];
                elements[3].elements.forEach(function (el) {
                    map[el.elements[2][0]] = el.elements[2][1];
                });
            }
            return map;
        },
        make_pair: function (input, start, end, elements) {
            return [elements[0], elements[4]];
        },
        make_string_s: function (input, start, end, elements) {
            return "'" + elements[1].text + "'";
        },
        make_string_d: function (input, start, end, elements) {
            return '"' + elements[1].text + '"';
        },
        make_string_t: function (input, start, end, elements) {
            return '`' + elements[1].text + '`';
        },
        make_list: function (input, start, end, elements) {
            var list = [elements[2]];
            elements[3].forEach(function (el) { list.push(el.value); });
            return list;
        },
        make_list_empty: function (input, start, end, elements) {
            return [];
        },
        make_integer: function (input, start, end, elements) {
            return parseNumber(input.substring(start, end));
        },
        make_float: function (input, start, end, elements) {
            return parseNumber(input.substring(start, end));
        },
        make_ws: function (input, start, end, elements) {
            return null;
        }
    };
    var extend = function (destination, source) {
        if (!destination || !source)
            return destination;
        for (var key in source) {
            if (destination[key] !== source[key])
                destination[key] = source[key];
        }
        return destination;
    };
    var formatError = function (input, offset, expected) {
        var lines = input.split(/\n/g), lineNo = 0, position = 0;
        while (position <= offset) {
            position += lines[lineNo].length + 1;
            lineNo += 1;
        }
        var message = 'Line ' + lineNo + ': expected ' + expected.join(', ') + '\n', line = lines[lineNo - 1];
        message += line + '\n';
        position -= line.length + 1;
        while (position < offset) {
            message += ' ';
            position += 1;
        }
        return message + '^';
    };
    var inherit = function (subclass, parent) {
        var chain = function () { };
        chain.prototype = parent.prototype;
        subclass.prototype = new chain();
        subclass.prototype.constructor = subclass;
    };
    var TreeNode = function (text, offset, elements) {
        this.text = text;
        this.offset = offset;
        this.elements = elements || [];
    };
    TreeNode.prototype.forEach = function (block, context) {
        for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
            block.call(context, el[i], i, el);
        }
    };
    var TreeNode1 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['value'] = elements[1];
    };
    inherit(TreeNode1, TreeNode);
    var TreeNode2 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['value'] = elements[1];
    };
    inherit(TreeNode2, TreeNode);
    var TreeNode3 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['pair'] = elements[2];
    };
    inherit(TreeNode3, TreeNode);
    var TreeNode4 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['word'] = elements[0];
        this['value'] = elements[4];
    };
    inherit(TreeNode4, TreeNode);
    var TreeNode5 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['value'] = elements[2];
    };
    inherit(TreeNode5, TreeNode);
    var TreeNode6 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['value'] = elements[1];
    };
    inherit(TreeNode6, TreeNode);
    var TreeNode7 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['end_of_word'] = elements[4];
    };
    inherit(TreeNode7, TreeNode);
    var TreeNode8 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['end_of_word'] = elements[3];
    };
    inherit(TreeNode8, TreeNode);
    var TreeNode9 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['end_of_word'] = elements[3];
    };
    inherit(TreeNode9, TreeNode);
    var TreeNode10 = function (text, offset, elements) {
        TreeNode.apply(this, arguments);
        this['end_of_word'] = elements[2];
    };
    inherit(TreeNode10, TreeNode);
    var FAILURE = {};
    var Grammar = {
        _read_pounce: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._pounce = this._cache._pounce || {};
            var cached = this._cache._pounce[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_pounce_pl();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_pounce_empty();
                if (address0 === FAILURE) {
                    this._offset = index1;
                }
            }
            this._cache._pounce[index0] = [address0, this._offset];
            return address0;
        },
        _read_pounce_pl: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._pounce_pl = this._cache._pounce_pl || {};
            var cached = this._cache._pounce_pl[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(4);
            var address1 = FAILURE;
            var remaining0 = 0, index2 = this._offset, elements1 = [], address2 = true;
            while (address2 !== FAILURE) {
                address2 = this._read_ws();
                if (address2 !== FAILURE) {
                    elements1.push(address2);
                    --remaining0;
                }
            }
            if (remaining0 <= 0) {
                address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                this._offset = this._offset;
            }
            else {
                address1 = FAILURE;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address3 = FAILURE;
                address3 = this._read_value();
                if (address3 !== FAILURE) {
                    elements0[1] = address3;
                    var address4 = FAILURE;
                    var remaining1 = 0, index3 = this._offset, elements2 = [], address5 = true;
                    while (address5 !== FAILURE) {
                        var index4 = this._offset, elements3 = new Array(2);
                        var address6 = FAILURE;
                        var remaining2 = 0, index5 = this._offset, elements4 = [], address7 = true;
                        while (address7 !== FAILURE) {
                            address7 = this._read_ws();
                            if (address7 !== FAILURE) {
                                elements4.push(address7);
                                --remaining2;
                            }
                        }
                        if (remaining2 <= 0) {
                            address6 = new TreeNode(this._input.substring(index5, this._offset), index5, elements4);
                            this._offset = this._offset;
                        }
                        else {
                            address6 = FAILURE;
                        }
                        if (address6 !== FAILURE) {
                            elements3[0] = address6;
                            var address8 = FAILURE;
                            address8 = this._read_value();
                            if (address8 !== FAILURE) {
                                elements3[1] = address8;
                            }
                            else {
                                elements3 = null;
                                this._offset = index4;
                            }
                        }
                        else {
                            elements3 = null;
                            this._offset = index4;
                        }
                        if (elements3 === null) {
                            address5 = FAILURE;
                        }
                        else {
                            address5 = new TreeNode2(this._input.substring(index4, this._offset), index4, elements3);
                            this._offset = this._offset;
                        }
                        if (address5 !== FAILURE) {
                            elements2.push(address5);
                            --remaining1;
                        }
                    }
                    if (remaining1 <= 0) {
                        address4 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
                        this._offset = this._offset;
                    }
                    else {
                        address4 = FAILURE;
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address9 = FAILURE;
                        var remaining3 = 0, index6 = this._offset, elements5 = [], address10 = true;
                        while (address10 !== FAILURE) {
                            address10 = this._read_ws();
                            if (address10 !== FAILURE) {
                                elements5.push(address10);
                                --remaining3;
                            }
                        }
                        if (remaining3 <= 0) {
                            address9 = new TreeNode(this._input.substring(index6, this._offset), index6, elements5);
                            this._offset = this._offset;
                        }
                        else {
                            address9 = FAILURE;
                        }
                        if (address9 !== FAILURE) {
                            elements0[3] = address9;
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_pounce_pl(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._pounce_pl[index0] = [address0, this._offset];
            return address0;
        },
        _read_pounce_empty: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._pounce_empty = this._cache._pounce_empty || {};
            var cached = this._cache._pounce_empty[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var remaining0 = 0, index1 = this._offset, elements0 = [], address1 = true;
            while (address1 !== FAILURE) {
                address1 = this._read_ws();
                if (address1 !== FAILURE) {
                    elements0.push(address1);
                    --remaining0;
                }
            }
            if (remaining0 <= 0) {
                address0 = this._actions.make_pounce_empty(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            else {
                address0 = FAILURE;
            }
            this._cache._pounce_empty[index0] = [address0, this._offset];
            return address0;
        },
        _read_word: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._word = this._cache._word || {};
            var cached = this._cache._word[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(2);
            var address1 = FAILURE;
            var remaining0 = 1, index2 = this._offset, elements1 = [], address2 = true;
            while (address2 !== FAILURE) {
                var chunk0 = null;
                if (this._offset < this._inputSize) {
                    chunk0 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk0 !== null && /^[a-zA-Z0-9\_\-\+\=\/\~\!\@\$\%\^\&\*\?\<\>]/.test(chunk0)) {
                    address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                }
                else {
                    address2 = FAILURE;
                    if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                    }
                    if (this._offset === this._failure) {
                        this._expected.push('[a-zA-Z0-9\\_\\-\\+\\=\\/\\~\\!\\@\\$\\%\\^\\&\\*\\?\\<\\>]');
                    }
                }
                if (address2 !== FAILURE) {
                    elements1.push(address2);
                    --remaining0;
                }
            }
            if (remaining0 <= 0) {
                address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                this._offset = this._offset;
            }
            else {
                address1 = FAILURE;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address3 = FAILURE;
                var remaining1 = 0, index3 = this._offset, elements2 = [], address4 = true;
                while (address4 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[a-zA-Z0-9\_\-\+\=\/\~\!\@\#\$\%\^\&\*\?\.\<\>]/.test(chunk1)) {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[a-zA-Z0-9\\_\\-\\+\\=\\/\\~\\!\\@\\#\\$\\%\\^\\&\\*\\?\\.\\<\\>]');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements2.push(address4);
                        --remaining1;
                    }
                }
                if (remaining1 <= 0) {
                    address3 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
                    this._offset = this._offset;
                }
                else {
                    address3 = FAILURE;
                }
                if (address3 !== FAILURE) {
                    elements0[1] = address3;
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_word(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._word[index0] = [address0, this._offset];
            return address0;
        },
        _read_value: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._value = this._cache._value || {};
            var cached = this._cache._value[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_list();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_number();
                if (address0 === FAILURE) {
                    this._offset = index1;
                    address0 = this._read_word();
                    if (address0 === FAILURE) {
                        this._offset = index1;
                        address0 = this._read_string();
                        if (address0 === FAILURE) {
                            this._offset = index1;
                            address0 = this._read_map();
                            if (address0 === FAILURE) {
                                this._offset = index1;
                            }
                        }
                    }
                }
            }
            this._cache._value[index0] = [address0, this._offset];
            return address0;
        },
        _read_map: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._map = this._cache._map || {};
            var cached = this._cache._map[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(6);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '{') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"{"');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    address3 = this._read_ws();
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var index3 = this._offset;
                    address4 = this._read_pair();
                    if (address4 === FAILURE) {
                        address4 = new TreeNode(this._input.substring(index3, index3), index3);
                        this._offset = index3;
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address5 = FAILURE;
                        var remaining1 = 0, index4 = this._offset, elements2 = [], address6 = true;
                        while (address6 !== FAILURE) {
                            var index5 = this._offset, elements3 = new Array(3);
                            var address7 = FAILURE;
                            var remaining2 = 0, index6 = this._offset, elements4 = [], address8 = true;
                            while (address8 !== FAILURE) {
                                address8 = this._read_ws();
                                if (address8 !== FAILURE) {
                                    elements4.push(address8);
                                    --remaining2;
                                }
                            }
                            if (remaining2 <= 0) {
                                address7 = new TreeNode(this._input.substring(index6, this._offset), index6, elements4);
                                this._offset = this._offset;
                            }
                            else {
                                address7 = FAILURE;
                            }
                            if (address7 !== FAILURE) {
                                elements3[0] = address7;
                                var address9 = FAILURE;
                                var remaining3 = 0, index7 = this._offset, elements5 = [], address10 = true;
                                while (address10 !== FAILURE) {
                                    address10 = this._read_ws();
                                    if (address10 !== FAILURE) {
                                        elements5.push(address10);
                                        --remaining3;
                                    }
                                }
                                if (remaining3 <= 0) {
                                    address9 = new TreeNode(this._input.substring(index7, this._offset), index7, elements5);
                                    this._offset = this._offset;
                                }
                                else {
                                    address9 = FAILURE;
                                }
                                if (address9 !== FAILURE) {
                                    elements3[1] = address9;
                                    var address11 = FAILURE;
                                    address11 = this._read_pair();
                                    if (address11 !== FAILURE) {
                                        elements3[2] = address11;
                                    }
                                    else {
                                        elements3 = null;
                                        this._offset = index5;
                                    }
                                }
                                else {
                                    elements3 = null;
                                    this._offset = index5;
                                }
                            }
                            else {
                                elements3 = null;
                                this._offset = index5;
                            }
                            if (elements3 === null) {
                                address6 = FAILURE;
                            }
                            else {
                                address6 = new TreeNode3(this._input.substring(index5, this._offset), index5, elements3);
                                this._offset = this._offset;
                            }
                            if (address6 !== FAILURE) {
                                elements2.push(address6);
                                --remaining1;
                            }
                        }
                        if (remaining1 <= 0) {
                            address5 = new TreeNode(this._input.substring(index4, this._offset), index4, elements2);
                            this._offset = this._offset;
                        }
                        else {
                            address5 = FAILURE;
                        }
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                            var address12 = FAILURE;
                            var remaining4 = 0, index8 = this._offset, elements6 = [], address13 = true;
                            while (address13 !== FAILURE) {
                                address13 = this._read_ws();
                                if (address13 !== FAILURE) {
                                    elements6.push(address13);
                                    --remaining4;
                                }
                            }
                            if (remaining4 <= 0) {
                                address12 = new TreeNode(this._input.substring(index8, this._offset), index8, elements6);
                                this._offset = this._offset;
                            }
                            else {
                                address12 = FAILURE;
                            }
                            if (address12 !== FAILURE) {
                                elements0[4] = address12;
                                var address14 = FAILURE;
                                var chunk1 = null;
                                if (this._offset < this._inputSize) {
                                    chunk1 = this._input.substring(this._offset, this._offset + 1);
                                }
                                if (chunk1 === '}') {
                                    address14 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                                    this._offset = this._offset + 1;
                                }
                                else {
                                    address14 = FAILURE;
                                    if (this._offset > this._failure) {
                                        this._failure = this._offset;
                                        this._expected = [];
                                    }
                                    if (this._offset === this._failure) {
                                        this._expected.push('"}"');
                                    }
                                }
                                if (address14 !== FAILURE) {
                                    elements0[5] = address14;
                                }
                                else {
                                    elements0 = null;
                                    this._offset = index1;
                                }
                            }
                            else {
                                elements0 = null;
                                this._offset = index1;
                            }
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_map(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._map[index0] = [address0, this._offset];
            return address0;
        },
        _read_pair: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._pair = this._cache._pair || {};
            var cached = this._cache._pair[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(5);
            var address1 = FAILURE;
            address1 = this._read_word();
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    address3 = this._read_ws();
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk0 = null;
                    if (this._offset < this._inputSize) {
                        chunk0 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk0 === ':') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('":"');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address5 = FAILURE;
                        var remaining1 = 0, index3 = this._offset, elements2 = [], address6 = true;
                        while (address6 !== FAILURE) {
                            address6 = this._read_ws();
                            if (address6 !== FAILURE) {
                                elements2.push(address6);
                                --remaining1;
                            }
                        }
                        if (remaining1 <= 0) {
                            address5 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
                            this._offset = this._offset;
                        }
                        else {
                            address5 = FAILURE;
                        }
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                            var address7 = FAILURE;
                            address7 = this._read_value();
                            if (address7 !== FAILURE) {
                                elements0[4] = address7;
                            }
                            else {
                                elements0 = null;
                                this._offset = index1;
                            }
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_pair(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._pair[index0] = [address0, this._offset];
            return address0;
        },
        _read_string: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._string = this._cache._string || {};
            var cached = this._cache._string[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_string_s();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_string_d();
                if (address0 === FAILURE) {
                    this._offset = index1;
                    address0 = this._read_string_t();
                    if (address0 === FAILURE) {
                        this._offset = index1;
                    }
                }
            }
            this._cache._string[index0] = [address0, this._offset];
            return address0;
        },
        _read_string_s: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._string_s = this._cache._string_s || {};
            var cached = this._cache._string_s[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(3);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '\'') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"\'"');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[^']/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[^\']');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '\'') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('"\'"');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_string_s(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._string_s[index0] = [address0, this._offset];
            return address0;
        },
        _read_string_d: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._string_d = this._cache._string_d || {};
            var cached = this._cache._string_d[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(3);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '"') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('\'"\'');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[^\"]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[^\\"]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '"') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('\'"\'');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_string_d(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._string_d[index0] = [address0, this._offset];
            return address0;
        },
        _read_string_t: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._string_t = this._cache._string_t || {};
            var cached = this._cache._string_t[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(3);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '`') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('\'`\'');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[^`]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[^`]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '`') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('\'`\'');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_string_t(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._string_t[index0] = [address0, this._offset];
            return address0;
        },
        _read_list: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._list = this._cache._list || {};
            var cached = this._cache._list[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_list_empty();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_list_full();
                if (address0 === FAILURE) {
                    this._offset = index1;
                }
            }
            this._cache._list[index0] = [address0, this._offset];
            return address0;
        },
        _read_list_empty: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._list_empty = this._cache._list_empty || {};
            var cached = this._cache._list_empty[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(3);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '[') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"["');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    address3 = this._read_ws();
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 === ']') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('"]"');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_list_empty(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._list_empty[index0] = [address0, this._offset];
            return address0;
        },
        _read_list_full: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._list_full = this._cache._list_full || {};
            var cached = this._cache._list_full[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(6);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '[') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"["');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    address3 = this._read_ws();
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    address4 = this._read_value();
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address5 = FAILURE;
                        var remaining1 = 0, index3 = this._offset, elements2 = [], address6 = true;
                        while (address6 !== FAILURE) {
                            var index4 = this._offset, elements3 = new Array(2);
                            var address7 = FAILURE;
                            var remaining2 = 0, index5 = this._offset, elements4 = [], address8 = true;
                            while (address8 !== FAILURE) {
                                address8 = this._read_ws();
                                if (address8 !== FAILURE) {
                                    elements4.push(address8);
                                    --remaining2;
                                }
                            }
                            if (remaining2 <= 0) {
                                address7 = new TreeNode(this._input.substring(index5, this._offset), index5, elements4);
                                this._offset = this._offset;
                            }
                            else {
                                address7 = FAILURE;
                            }
                            if (address7 !== FAILURE) {
                                elements3[0] = address7;
                                var address9 = FAILURE;
                                address9 = this._read_value();
                                if (address9 !== FAILURE) {
                                    elements3[1] = address9;
                                }
                                else {
                                    elements3 = null;
                                    this._offset = index4;
                                }
                            }
                            else {
                                elements3 = null;
                                this._offset = index4;
                            }
                            if (elements3 === null) {
                                address6 = FAILURE;
                            }
                            else {
                                address6 = new TreeNode6(this._input.substring(index4, this._offset), index4, elements3);
                                this._offset = this._offset;
                            }
                            if (address6 !== FAILURE) {
                                elements2.push(address6);
                                --remaining1;
                            }
                        }
                        if (remaining1 <= 0) {
                            address5 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
                            this._offset = this._offset;
                        }
                        else {
                            address5 = FAILURE;
                        }
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                            var address10 = FAILURE;
                            var remaining3 = 0, index6 = this._offset, elements5 = [], address11 = true;
                            while (address11 !== FAILURE) {
                                address11 = this._read_ws();
                                if (address11 !== FAILURE) {
                                    elements5.push(address11);
                                    --remaining3;
                                }
                            }
                            if (remaining3 <= 0) {
                                address10 = new TreeNode(this._input.substring(index6, this._offset), index6, elements5);
                                this._offset = this._offset;
                            }
                            else {
                                address10 = FAILURE;
                            }
                            if (address10 !== FAILURE) {
                                elements0[4] = address10;
                                var address12 = FAILURE;
                                var chunk1 = null;
                                if (this._offset < this._inputSize) {
                                    chunk1 = this._input.substring(this._offset, this._offset + 1);
                                }
                                if (chunk1 === ']') {
                                    address12 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                                    this._offset = this._offset + 1;
                                }
                                else {
                                    address12 = FAILURE;
                                    if (this._offset > this._failure) {
                                        this._failure = this._offset;
                                        this._expected = [];
                                    }
                                    if (this._offset === this._failure) {
                                        this._expected.push('"]"');
                                    }
                                }
                                if (address12 !== FAILURE) {
                                    elements0[5] = address12;
                                }
                                else {
                                    elements0 = null;
                                    this._offset = index1;
                                }
                            }
                            else {
                                elements0 = null;
                                this._offset = index1;
                            }
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_list(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._list_full[index0] = [address0, this._offset];
            return address0;
        },
        _read_number: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._number = this._cache._number || {};
            var cached = this._cache._number[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_float1();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_float2();
                if (address0 === FAILURE) {
                    this._offset = index1;
                    address0 = this._read_float3();
                    if (address0 === FAILURE) {
                        this._offset = index1;
                        address0 = this._read_integer();
                        if (address0 === FAILURE) {
                            this._offset = index1;
                        }
                    }
                }
            }
            this._cache._number[index0] = [address0, this._offset];
            return address0;
        },
        _read_float1: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._float1 = this._cache._float1 || {};
            var cached = this._cache._float1[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(5);
            var address1 = FAILURE;
            var index2 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '-') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"-"');
                }
            }
            if (address1 === FAILURE) {
                address1 = new TreeNode(this._input.substring(index2, index2), index2);
                this._offset = index2;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 1, index3 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[0-9]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '.') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('"."');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address5 = FAILURE;
                        var remaining1 = 1, index4 = this._offset, elements2 = [], address6 = true;
                        while (address6 !== FAILURE) {
                            var chunk3 = null;
                            if (this._offset < this._inputSize) {
                                chunk3 = this._input.substring(this._offset, this._offset + 1);
                            }
                            if (chunk3 !== null && /^[0-9]/.test(chunk3)) {
                                address6 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                                this._offset = this._offset + 1;
                            }
                            else {
                                address6 = FAILURE;
                                if (this._offset > this._failure) {
                                    this._failure = this._offset;
                                    this._expected = [];
                                }
                                if (this._offset === this._failure) {
                                    this._expected.push('[0-9]');
                                }
                            }
                            if (address6 !== FAILURE) {
                                elements2.push(address6);
                                --remaining1;
                            }
                        }
                        if (remaining1 <= 0) {
                            address5 = new TreeNode(this._input.substring(index4, this._offset), index4, elements2);
                            this._offset = this._offset;
                        }
                        else {
                            address5 = FAILURE;
                        }
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                            var address7 = FAILURE;
                            address7 = this._read_end_of_word();
                            if (address7 !== FAILURE) {
                                elements0[4] = address7;
                            }
                            else {
                                elements0 = null;
                                this._offset = index1;
                            }
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_float(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._float1[index0] = [address0, this._offset];
            return address0;
        },
        _read_float2: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._float2 = this._cache._float2 || {};
            var cached = this._cache._float2[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(4);
            var address1 = FAILURE;
            var index2 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '-') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"-"');
                }
            }
            if (address1 === FAILURE) {
                address1 = new TreeNode(this._input.substring(index2, index2), index2);
                this._offset = index2;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var chunk1 = null;
                if (this._offset < this._inputSize) {
                    chunk1 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk1 === '.') {
                    address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                }
                else {
                    address2 = FAILURE;
                    if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                    }
                    if (this._offset === this._failure) {
                        this._expected.push('"."');
                    }
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address3 = FAILURE;
                    var remaining0 = 1, index3 = this._offset, elements1 = [], address4 = true;
                    while (address4 !== FAILURE) {
                        var chunk2 = null;
                        if (this._offset < this._inputSize) {
                            chunk2 = this._input.substring(this._offset, this._offset + 1);
                        }
                        if (chunk2 !== null && /^[0-9]/.test(chunk2)) {
                            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                            this._offset = this._offset + 1;
                        }
                        else {
                            address4 = FAILURE;
                            if (this._offset > this._failure) {
                                this._failure = this._offset;
                                this._expected = [];
                            }
                            if (this._offset === this._failure) {
                                this._expected.push('[0-9]');
                            }
                        }
                        if (address4 !== FAILURE) {
                            elements1.push(address4);
                            --remaining0;
                        }
                    }
                    if (remaining0 <= 0) {
                        address3 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
                        this._offset = this._offset;
                    }
                    else {
                        address3 = FAILURE;
                    }
                    if (address3 !== FAILURE) {
                        elements0[2] = address3;
                        var address5 = FAILURE;
                        address5 = this._read_end_of_word();
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_float(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._float2[index0] = [address0, this._offset];
            return address0;
        },
        _read_float3: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._float3 = this._cache._float3 || {};
            var cached = this._cache._float3[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(4);
            var address1 = FAILURE;
            var index2 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '-') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"-"');
                }
            }
            if (address1 === FAILURE) {
                address1 = new TreeNode(this._input.substring(index2, index2), index2);
                this._offset = index2;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 1, index3 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[0-9]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '.') {
                        address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address4 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('"."');
                        }
                    }
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                        var address5 = FAILURE;
                        address5 = this._read_end_of_word();
                        if (address5 !== FAILURE) {
                            elements0[3] = address5;
                        }
                        else {
                            elements0 = null;
                            this._offset = index1;
                        }
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_float(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._float3[index0] = [address0, this._offset];
            return address0;
        },
        _read_integer: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._integer = this._cache._integer || {};
            var cached = this._cache._integer[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(3);
            var address1 = FAILURE;
            var index2 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '-') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"-"');
                }
            }
            if (address1 === FAILURE) {
                address1 = new TreeNode(this._input.substring(index2, index2), index2);
                this._offset = index2;
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 1, index3 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[0-9]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                    var address4 = FAILURE;
                    address4 = this._read_end_of_word();
                    if (address4 !== FAILURE) {
                        elements0[2] = address4;
                    }
                    else {
                        elements0 = null;
                        this._offset = index1;
                    }
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = this._actions.make_integer(this._input, index1, this._offset, elements0);
                this._offset = this._offset;
            }
            this._cache._integer[index0] = [address0, this._offset];
            return address0;
        },
        _read_end_of_word: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._end_of_word = this._cache._end_of_word || {};
            var cached = this._cache._end_of_word[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            var index2 = this._offset;
            address0 = this._read_ws();
            this._offset = index2;
            if (address0 !== FAILURE) {
                address0 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
                this._offset = this._offset;
            }
            else {
                address0 = FAILURE;
            }
            if (address0 === FAILURE) {
                this._offset = index1;
                var index3 = this._offset;
                var chunk0 = null;
                if (this._offset < this._inputSize) {
                    chunk0 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk0 === '[') {
                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                }
                else {
                    address0 = FAILURE;
                    if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                    }
                    if (this._offset === this._failure) {
                        this._expected.push('"["');
                    }
                }
                this._offset = index3;
                if (address0 !== FAILURE) {
                    address0 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
                    this._offset = this._offset;
                }
                else {
                    address0 = FAILURE;
                }
                if (address0 === FAILURE) {
                    this._offset = index1;
                    var index4 = this._offset;
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 === ']') {
                        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address0 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('"]"');
                        }
                    }
                    this._offset = index4;
                    if (address0 !== FAILURE) {
                        address0 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
                        this._offset = this._offset;
                    }
                    else {
                        address0 = FAILURE;
                    }
                    if (address0 === FAILURE) {
                        this._offset = index1;
                        var index5 = this._offset;
                        var chunk2 = null;
                        if (this._offset < this._inputSize) {
                            chunk2 = this._input.substring(this._offset, this._offset + 1);
                        }
                        if (chunk2 === '{') {
                            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                            this._offset = this._offset + 1;
                        }
                        else {
                            address0 = FAILURE;
                            if (this._offset > this._failure) {
                                this._failure = this._offset;
                                this._expected = [];
                            }
                            if (this._offset === this._failure) {
                                this._expected.push('"{"');
                            }
                        }
                        this._offset = index5;
                        if (address0 !== FAILURE) {
                            address0 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
                            this._offset = this._offset;
                        }
                        else {
                            address0 = FAILURE;
                        }
                        if (address0 === FAILURE) {
                            this._offset = index1;
                            var index6 = this._offset;
                            var chunk3 = null;
                            if (this._offset < this._inputSize) {
                                chunk3 = this._input.substring(this._offset, this._offset + 1);
                            }
                            if (chunk3 === '}') {
                                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                                this._offset = this._offset + 1;
                            }
                            else {
                                address0 = FAILURE;
                                if (this._offset > this._failure) {
                                    this._failure = this._offset;
                                    this._expected = [];
                                }
                                if (this._offset === this._failure) {
                                    this._expected.push('"}"');
                                }
                            }
                            this._offset = index6;
                            if (address0 !== FAILURE) {
                                address0 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
                                this._offset = this._offset;
                            }
                            else {
                                address0 = FAILURE;
                            }
                            if (address0 === FAILURE) {
                                this._offset = index1;
                                var remaining0 = 1, index7 = this._offset, elements0 = [], address1 = true;
                                while (address1 !== FAILURE) {
                                    var chunk4 = null;
                                    if (this._offset < this._inputSize) {
                                        chunk4 = this._input.substring(this._offset, this._offset + 1);
                                    }
                                    if (chunk4 !== null && /^[$]/.test(chunk4)) {
                                        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                                        this._offset = this._offset + 1;
                                    }
                                    else {
                                        address1 = FAILURE;
                                        if (this._offset > this._failure) {
                                            this._failure = this._offset;
                                            this._expected = [];
                                        }
                                        if (this._offset === this._failure) {
                                            this._expected.push('[$]');
                                        }
                                    }
                                    if (address1 !== FAILURE) {
                                        elements0.push(address1);
                                        --remaining0;
                                    }
                                }
                                if (remaining0 <= 0) {
                                    address0 = new TreeNode(this._input.substring(index7, this._offset), index7, elements0);
                                    this._offset = this._offset;
                                }
                                else {
                                    address0 = FAILURE;
                                }
                                if (address0 === FAILURE) {
                                    this._offset = index1;
                                }
                            }
                        }
                    }
                }
            }
            this._cache._end_of_word[index0] = [address0, this._offset];
            return address0;
        },
        _read_ws: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._ws = this._cache._ws || {};
            var cached = this._cache._ws[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_newline();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_space();
                if (address0 === FAILURE) {
                    this._offset = index1;
                    address0 = this._read_tab();
                    if (address0 === FAILURE) {
                        this._offset = index1;
                        address0 = this._read_comment();
                        if (address0 === FAILURE) {
                            this._offset = index1;
                            address0 = this._read_end_of_string();
                            if (address0 === FAILURE) {
                                this._offset = index1;
                            }
                        }
                    }
                }
            }
            this._cache._ws[index0] = [address0, this._offset];
            return address0;
        },
        _read_space: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._space = this._cache._space || {};
            var cached = this._cache._space[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && /^[\s]/.test(chunk0)) {
                address0 = this._actions.make_ws(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
            }
            else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('[\\s]');
                }
            }
            this._cache._space[index0] = [address0, this._offset];
            return address0;
        },
        _read_tab: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._tab = this._cache._tab || {};
            var cached = this._cache._tab[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && /^[\t]/.test(chunk0)) {
                address0 = this._actions.make_ws(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
            }
            else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('[\\t]');
                }
            }
            this._cache._tab[index0] = [address0, this._offset];
            return address0;
        },
        _read_newline: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._newline = this._cache._newline || {};
            var cached = this._cache._newline[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset;
            address0 = this._read_newline1();
            if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_newline2();
                if (address0 === FAILURE) {
                    this._offset = index1;
                }
            }
            this._cache._newline[index0] = [address0, this._offset];
            return address0;
        },
        _read_newline1: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._newline1 = this._cache._newline1 || {};
            var cached = this._cache._newline1[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && /^[\r]/.test(chunk0)) {
                address0 = this._actions.make_ws(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
            }
            else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('[\\r]');
                }
            }
            this._cache._newline1[index0] = [address0, this._offset];
            return address0;
        },
        _read_newline2: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._newline2 = this._cache._newline2 || {};
            var cached = this._cache._newline2[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && /^[\n]/.test(chunk0)) {
                address0 = this._actions.make_ws(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
            }
            else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('[\\n]');
                }
            }
            this._cache._newline2[index0] = [address0, this._offset];
            return address0;
        },
        _read_comment: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._comment = this._cache._comment || {};
            var cached = this._cache._comment[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var index1 = this._offset, elements0 = new Array(2);
            var address1 = FAILURE;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === '#') {
                address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
            }
            else {
                address1 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('"#"');
                }
            }
            if (address1 !== FAILURE) {
                elements0[0] = address1;
                var address2 = FAILURE;
                var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
                while (address3 !== FAILURE) {
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                        chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 !== null && /^[^\n]/.test(chunk1)) {
                        address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                    }
                    else {
                        address3 = FAILURE;
                        if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                        }
                        if (this._offset === this._failure) {
                            this._expected.push('[^\\n]');
                        }
                    }
                    if (address3 !== FAILURE) {
                        elements1.push(address3);
                        --remaining0;
                    }
                }
                if (remaining0 <= 0) {
                    address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                    this._offset = this._offset;
                }
                else {
                    address2 = FAILURE;
                }
                if (address2 !== FAILURE) {
                    elements0[1] = address2;
                }
                else {
                    elements0 = null;
                    this._offset = index1;
                }
            }
            else {
                elements0 = null;
                this._offset = index1;
            }
            if (elements0 === null) {
                address0 = FAILURE;
            }
            else {
                address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
                this._offset = this._offset;
            }
            this._cache._comment[index0] = [address0, this._offset];
            return address0;
        },
        _read_end_of_string: function () {
            var address0 = FAILURE, index0 = this._offset;
            this._cache._end_of_string = this._cache._end_of_string || {};
            var cached = this._cache._end_of_string[index0];
            if (cached) {
                this._offset = cached[1];
                return cached[0];
            }
            var chunk0 = null;
            if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && /^[$]/.test(chunk0)) {
                address0 = this._actions.make_ws(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
            }
            else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                }
                if (this._offset === this._failure) {
                    this._expected.push('[$]');
                }
            }
            this._cache._end_of_string[index0] = [address0, this._offset];
            return address0;
        }
    };
    var Parser = function (input, actions, types) {
        if (actions === void 0) { actions = parser_actions; }
        this._input = input;
        this._inputSize = input.length;
        this._actions = actions;
        this._types = types;
        this._offset = 0;
        this._cache = {};
        this._failure = 0;
        this._expected = [];
    };
    Parser.prototype.parse = function () {
        var tree = this._read_pounce();
        if (tree !== FAILURE && this._offset === this._inputSize) {
            return tree;
        }
        if (this._expected.length === 0) {
            this._failure = this._offset;
            this._expected.push('<EOF>');
        }
        this.constructor.lastError = { offset: this._offset, expected: this._expected };
        throw new SyntaxError(formatError(this._input, this._failure, this._expected));
    };
    var strip_quotes = function (s) {
        var len = s.length;
        if (len > 1 && s[0] === '"' && s[len - 1] === '"') {
            return s.slice(1, -1);
        }
        return s;
    };
    var cbaNumber = function (s) {
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
    };
    var parseNumber = function (s) {
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
        return parseFloat("NaN");
    };
    var cleanStrings = function (pl) {
        if (r.is(Array, pl)) {
            return pl.map(function (i) {
                if (r.is(String, i)) {
                    if (i === 'true')
                        return true;
                    if (i === 'false')
                        return false;
                    var cbaN = cbaNumber(i); // cbaNumber(strip_quotes(i));
                    return r.is(String, cbaN) ? strip_quotes(i) : cbaN;
                }
                return cleanStrings(i);
            });
        }
        return pl; //cbaNumber(strip_quotes(pl));
    };
    var parse = function (input, options) {
        options = options || {};
        var parser = new Parser(input + " ", options.actions, options.types);
        return cleanStrings(parser.parse());
    };
    extend(Parser.prototype, Grammar);
    return { Grammar: Grammar, Parser: Parser, parse: parse };
};
var unParser = function (pl) {
    var ps = '';
    var spacer = '';
    for (var i in pl) {
        if (pl[i] && typeof pl[i] == "object") {
            if (Array.isArray(pl[i])) {
                ps += spacer + '[' + unParser(pl[i]) + ']';
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
};
var unParseKeyValuePair = function (pl) {
    var ps = '';
    var spacer = '';
    for (var i in pl) {
        if (pl.hasOwnProperty(i)) {
            if (pl[i] && typeof pl[i] == "object") {
                if (Array.isArray(pl[i])) {
                    ps += spacer + i + ':[' + unParser(pl[i]) + ']';
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
};
var p = pinnaParser();
var parser = p.parse;

var parse = parser;
var unParse = unParser;
// insizer
var preProcessDefs = function (pl) {
    var defineWord = function (wd, key, val) {
        var new_word = {};
        new_word[key] = val;
        // ToDo: implement a safe mode that would throw a preProcesser error if key is already defined.
        return r.mergeRight(wd, new_word);
    };
    // non-FP section (candidate for refactor)
    var next_pl = __spreadArrays(pl);
    var next_wd = {};
    var def_i = r.findIndex(function (word) { return word === 'def'; }, next_pl);
    while (def_i !== -1) {
        if (def_i >= 2) {
            var word = toPLOrNull(next_pl[def_i - 2]);
            var key = toStringOrNull(r.head(toArrOrNull(next_pl[def_i - 1])));
            next_pl.splice(def_i - 2, 3); // splice is particularly mutant
            next_wd = defineWord(next_wd, key, { "def": word });
        }
        def_i = r.findIndex(function (word) { return word === 'def'; }, next_pl);
    }
    return [next_pl, next_wd];
};
function purr(pl_in, wd_in, opt) {
    var _a, pl, user_def_wd, wd, s, _b, w, maxCycles, cycles, wds, _c, plist, _d;
    var _e, _f, _g;
    if (wd_in === void 0) { wd_in = coreWords; }
    if (opt === void 0) { opt = { debug: false, yieldOnId: false }; }
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = preProcessDefs(pl_in), pl = _a[0], user_def_wd = _a[1];
                wd = r.mergeRight(wd_in, user_def_wd);
                s = [];
                if (!((_h = opt) === null || _h === void 0 ? void 0 : _h.debug)) return [3 /*break*/, 2];
                return [4 /*yield*/, [s, pl, true, user_def_wd]];
            case 1:
                _b = _j.sent();
                return [3 /*break*/, 3];
            case 2:
                _b = null;
                _j.label = 3;
            case 3:
                maxCycles = opt.maxCycles || 1000000;
                cycles = 0;
                _j.label = 4;
            case 4:
                if (!(cycles < maxCycles && (w = pl.shift()) !== undefined)) return [3 /*break*/, 13];
                cycles += 1;
                wds = r.is(String, w) ? wd[w] : null;
                if (!wds) return [3 /*break*/, 8];
                if (!(opt.debug && !opt.yieldOnId)) return [3 /*break*/, 6];
                return [4 /*yield*/, [s, [w].concat(pl), true]];
            case 5:
                _c = _j.sent();
                return [3 /*break*/, 7];
            case 6:
                _c = null;
                _j.label = 7;
            case 7:
                if (typeof wds.def === 'function') {
                    _e = wds.def(s, pl, wd), s = _e[0], _f = _e[1], pl = _f === void 0 ? pl : _f, _g = _e[2], wd = _g === void 0 ? wd : _g;
                }
                else {
                    plist = toPLOrNull(wds.def);
                    if (plist) {
                        pl.unshift.apply(pl, plist);
                    }
                }
                return [3 /*break*/, 12];
            case 8:
                if (!(w !== undefined)) return [3 /*break*/, 12];
                if (r.is(Array, w)) {
                    s.push([].concat(w));
                }
                else {
                    s.push(w);
                }
                if (!(opt.debug && opt.yieldOnId)) return [3 /*break*/, 10];
                return [4 /*yield*/, [s, pl, true]];
            case 9:
                _d = _j.sent();
                return [3 /*break*/, 11];
            case 10:
                _d = null;
                _j.label = 11;
            case 11:
                _j.label = 12;
            case 12: return [3 /*break*/, 4];
            case 13:
                if (!(cycles >= maxCycles)) return [3 /*break*/, 15];
                return [4 /*yield*/, [[s, pl, false], "maxCycles exceeded: this may be an infinite loop "]];
            case 14:
                _j.sent();
                _j.label = 15;
            case 15: return [4 /*yield*/, [s, pl, false]];
            case 16:
                _j.sent();
                return [2 /*return*/];
        }
    });
}

exports.parse = parse;
exports.preProcessDefs = preProcessDefs;
exports.purr = purr;
exports.unParse = unParse;
