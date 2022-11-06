import { is, keys, omit, path, map, zipObj, reverse, head, tail, init, last, propOr, findIndex, mergeRight, concat } from 'ramda';
import NP from 'number-precision';
import Prando from 'prando';

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
                if (chunk0 !== null && /^[a-zA-Z0-9\|\_\-\+\=\/\~\!\@\$\%\^\&\*\?\<\>]/.test(chunk0)) {
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
                        this._expected.push('[a-zA-Z0-9\\|\\_\\-\\+\\=\\/\\~\\!\\@\\$\\%\\^\\&\\*\\?\\<\\>]');
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
        if (is(Array, pl)) {
            return pl.map(function (i) {
                if (is(String, i)) {
                    if (i === 'true')
                        return true;
                    if (i === 'false')
                        return false;
                    var cbaN = cbaNumber(i); // cbaNumber(strip_quotes(i));
                    return is(String, cbaN) ? strip_quotes(i) : cbaN;
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

NP.enableBoundaryChecking(false);
var compareObjects = function (a, b) {
    if (a === b)
        return true;
    if (typeof a != 'object' || typeof b != 'object' || a == null || b == null)
        return false;
    var keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length != keysB.length)
        return false;
    for (var _i = 0, keysA_1 = keysA; _i < keysA_1.length; _i++) {
        var key = keysA_1[_i];
        if (!keysB.includes(key))
            return false;
        if (typeof a[key] === 'function' || typeof b[key] === 'function') {
            if (a[key].toString() != b[key].toString())
                return false;
        }
        else {
            if (!compareObjects(a[key], b[key]))
                return false;
        }
    }
    return true;
};
var rng;
var toNumOrNull = function (u) {
    return is(Number, u) ? u : null;
};
var toArrOrNull = function (u) {
    return is(Array, u) ? u : null;
};
var toArrOfStrOrNull = function (u) {
    return is(Array, u) ? u : null;
};
var toStringOrNull = function (u) {
    return is(String, u) ? u : null;
};
var toPLOrNull = function (u) {
    return is(Array, u) ? u : null;
};
var toBoolOrNull = function (u) {
    return is(Boolean, u) ? u : null;
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
    if (is(Object, u) !== null) {
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
    if (is(String, w)) {
        var newW = toWordOrNull(propOr(w, w, localWD));
        return newW !== null ? newW : w;
    }
    var subList = toPLOrNull(w);
    if (is(Array, subList)) {
        return subInWD(localWD, __spreadArrays(subList));
    }
    return w;
}; };
var subInWD = function (localWD, words) {
    var resolveWord = consReslover(localWD);
    return map(resolveWord, words);
};
var coreWords = {
    'words': {
        compose: function (s) {
            s.push(introspectWords());
            return [s];
        }
    },
    // introspectWord
    'word': {
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
        dt: '[[A][A A] bind]',
        compose: function (s) { s.push(clone(s[s.length - 1])); return [s]; }
        // s => { s.push(s[s.length - 1]); return [s]; }
    },
    'dup2': {
        dt: '[[C D][C D C D] bind]',
        compose: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    },
    'swap': {
        dt: '[[C D][D C] bind]',
        compose: function (s) {
            var top = s === null || s === void 0 ? void 0 : s.pop();
            var under = s === null || s === void 0 ? void 0 : s.pop();
            s.push(top);
            s.push(under);
            return [s];
        }
    },
    'drop': {
        dt: '[[A][] bind]',
        compose: function (s) { s === null || s === void 0 ? void 0 : s.pop(); return [s]; }
    },
    'round': {
        compose: function (s) {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), 'number');
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
        dt: '[[N N][N] comp]',
        compose: function (s) {
            // const b = <number | null>toTypeOrNull<number | null>(s?.pop(), 'number');
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
        dt: '[[N N] [N] comp]',
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
        dt: '[[N N][N] comp  [N|0 !=] guard]',
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
        dt: '[[N N][N] comp]',
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
        dt: '[[N N][N] comp]',
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
        dt: '[[N N][N] comp]',
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
        dt: '[[N N][N] comp]',
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
        dt: '[[N N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[B B] [B] comp]',
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
        dt: '[[B B][B] comp]',
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
        dt: '[[B][B] comp]',
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
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.E);
            return [s];
        }
    },
    // Math.LN10
    'LN10': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.LN10);
            return [s];
        }
    },
    // Math.LN2
    'LN2': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.LN2);
            return [s];
        }
    },
    // Math.LOG10E
    'LOG10E': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.LOG10E);
            return [s];
        }
    },
    // Math.LOG2E
    'LOG2E': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.LOG2E);
            return [s];
        }
    },
    // Math.PI
    'PI': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.PI);
            return [s];
        }
    },
    // Math.SQRT1_2
    'SQRT1_2': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.SQRT1_2);
            return [s];
        }
    },
    // Math.SQRT2
    'SQRT2': {
        dt: '[[]][N] comp]',
        compose: function (s) {
            s.push(Math.SQRT2);
            return [s];
        }
    },
    // Math.abs()
    'abs': {
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N N][N] comp]',
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var b = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
    // seedrandom
    'seedrandom': {
        dt: '[[N][] comp]',
        compose: function (s) {
            var a = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
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
        compose: function (s) {
            s.push(rng.next());
            return [s];
        }
    },
    // Math.sign()
    'sign': {
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[N][N] comp]',
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
        dt: '[[F][F run] bind]',
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
    // binds names to stack values within one phrase of words
    'crouch': {
        dt: '[[[S+]F][F]]',
        compose: function (s, pl) {
            var words = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var argList = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (words !== null && argList) {
                var values = map(function () { return s === null || s === void 0 ? void 0 : s.pop(); }, argList);
                var localWD = zipObj(reverse(argList), values);
                var newWords = toPLOrNull(subInWD(localWD, words));
                if (newWords) {
                    s.push(newWords);
                }
            }
            return [s, pl];
        }
    },
    'pounce': {
        dt: '[[[S+]F][F run]]',
        compose: function (s, pl) {
            var words = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var argList = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (words !== null && argList) {
                var values = map(function () { return s === null || s === void 0 ? void 0 : s.pop(); }, argList);
                var localWD = zipObj(reverse(argList), values);
                var newWords = toPLOrNull(subInWD(localWD, words));
                if (newWords) {
                    pl = newWords.concat(pl);
                }
            }
            return [s, pl];
        }
    },
    'dip': {
        dt: '[[A F][F run A] bind]',
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
        dt: '[[A C F][F run A C] bind]',
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
        compose: function (s, pl) {
            var else_block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var then_block = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var condition = toBoolOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (condition === null || then_block === null || else_block === null) {
                return [null];
            }
            if (condition) {
                if (is(Array, then_block)) {
                    pl = then_block.concat(pl);
                }
                else {
                    pl.unshift(then_block);
                }
            }
            else {
                if (is(Array, else_block)) {
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
                else {
                    var e = toPLOrNull(top);
                    var f = toPLOrNull(s[s.length - 1]);
                    if (e !== null && f !== null) {
                        s.push(unParser(e) === unParser(f));
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
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a === num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a === str_b);
                return [s];
            }
            var e = toPLOrNull(a);
            var f = toPLOrNull(b);
            if (e !== null && f !== null) {
                s.push(unParser(e) === unParser(f));
                return [s];
            }
            s.push(false);
            return [s];
        }
    },
    '!=': {
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a !== num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a !== str_b);
                return [s];
            }
            var e = toPLOrNull(a);
            var f = toPLOrNull(b);
            if (e !== null && f !== null) {
                s.push(unParser(e) !== unParser(f));
                return [s];
            }
            s.push(true);
            return [s];
        }
    },
    '>': {
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a > num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) > 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '<': {
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a < num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) < 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '>=': {
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a >= num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
            if (str_a !== null && str_b !== null) {
                s.push(str_a.localeCompare(str_b) >= 0);
                return [s];
            }
            s.push(null);
            return [s];
        }
    },
    '<=': {
        compose: function (s) {
            var b = s === null || s === void 0 ? void 0 : s.pop();
            var a = s === null || s === void 0 ? void 0 : s.pop();
            var num_b = toNumOrNull(b);
            var num_a = toNumOrNull(a);
            if (num_a !== null && num_b !== null) {
                s.push(num_a <= num_b);
                return [s];
            }
            var str_b = toStringOrNull(b);
            var str_a = toStringOrNull(a);
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
        dt: '[[A [C*]][[A C*]] bind]',
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
        dt: '[[[A+]][Af [Ar]] bind]',
        compose: function (s) {
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (arr) {
                s.push(head(arr), tail(arr));
            }
            return [s];
        }
    },
    'push': {
        dt: '[[[A*] C][[A C]] bind]',
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
        dt: '[[[A+]][[Ab] Al] bind]',
        compose: function (s) {
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (arr) {
                s.push(init(arr), last(arr));
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
                // console.error("In 'constrec' some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null];
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
        compose: function (s, pl) {
            // termtest && terminal && recurse && final linrec 
            var final = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop()); // F
            var recurse = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop()); // G
            var terminal = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop()); // H
            var termtest = toPLOrNull(s === null || s === void 0 ? void 0 : s.pop()); // I
            if (termtest && terminal && recurse && final) {
                var nextRec = __spreadArrays([termtest, terminal, recurse, final, 'linrec'], final);
                pl = __spreadArrays(termtest, [terminal, __spreadArrays(recurse, nextRec), 'if-else']).concat(pl);
            }
            else {
                // console.error("In 'linrec' some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null];
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
                // console.error("In 'linrec5' some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null];
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
                // console.error("In 'binrec' some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null];
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
        compose: [["list", "phrase"],
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
    // // 'split': {
    // //     compose: [["cutVal", "theList", "operator"], [
    // //         [], [], "cutVal", "theList",
    // //         'size',
    // //         ['uncons',
    // //             ['dup2', "operator", "play",
    // //                 ['swap', ['swap', ['push'], 'dip'], 'dip'],
    // //                 ['swap', ['push'], 'dip'], 'if-else'], 'dip',
    // //         ], 'swap', 'times', 'drop', 'swap', ['push'], 'dip'
    // //     ], "pounce"]
    // // },
    'split': {
        compose: [["cutVal", "theList", "operator"], [
                "theList", "cutVal", "operator", "cons", ["!"], "concat", "filter", "cutVal", "push",
                "theList", "cutVal", "operator", "cons", "filter",
            ], "pounce"]
    },
    'spliti': {
        compose: [["theList", "cutValIndex", "operator"], [
                "theList", "cutValIndex", "outAt", "operator", "cons", ["!"], "concat", "filter",
                "theList", "cutValIndex", "outAt", "operator", "cons", "filter",
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
    'outAt': {
        compose: function (s) {
            var i = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var arr = toArrOrNull(s[s.length - 1]);
            if (i !== null && arr && arr.length - 1 >= i) {
                s.push(arr[i]);
                return [s];
            }
            var str = toStringOrNull(s[s.length - 1]);
            if (i !== null && str && str.length - 1 >= i) {
                s.push(str[i]);
                return [s];
            }
            // console.error("In 'outAt' some stack value(s) not found", "i =", i, arr, str);
            // throw new Error("stack value(s) not found");
            return [null];
        }
    },
    'inAt': {
        compose: function (s) {
            var i = toNumOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var ele = toWordOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var arr = toArrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (i !== null && ele !== null && arr && arr.length - 1 >= i) {
                arr[i] = ele;
                s.push(arr);
            }
            else {
                // console.error("In 'inAt' some stack value(s) not found");
                // throw new Error("stack value(s) not found");
                return [null];
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
        compose: function (s, pl) {
            var item = s === null || s === void 0 ? void 0 : s.pop();
            var aNumber = toNumOrNull(item);
            if ((aNumber || aNumber === 0) && aNumber >= 0) {
                s.push("Nat");
                return [s];
            }
            if (aNumber && aNumber < 0) {
                s.push("Neg");
                return [s];
            }
            var aString = toStringOrNull(item);
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
            var aList = toArrOrNull(item);
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
        compose: function (s, pl) {
            var item = s === null || s === void 0 ? void 0 : s.pop();
            var aString = toStringOrNull(item);
            if (aString &&
                (aString === 'Str'
                    || aString === 'Nat'
                    || aString === 'Neg'
                    || aString === 'Zero')) {
                s.push(true);
                return [s];
            }
            var aList = toArrOrNull(item);
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
var introspectWords = function () { return keys(omit(['popInternalCallStack'], coreWords)); };
var introspectWord = function (wn) { return JSON.parse(JSON.stringify(path([wn], coreWords))); };
var clone = function (source) {
    if (source === null)
        return source;
    if (source instanceof Date)
        return new Date(source.getTime());
    if (source instanceof Array)
        return source.map(function (item) { return clone(item); });
    if (typeof source === 'object' && source !== {}) {
        var clonnedObj_1 = __assign({}, source);
        Object.keys(clonnedObj_1).forEach(function (prop) {
            clonnedObj_1[prop] = clone(clonnedObj_1[prop]);
        });
        return clonnedObj_1;
    }
    return source;
};
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

var preProcessDefs = function (pl, coreWords) {
    var defineWord = function (wd, key, val) {
        var new_word = {};
        new_word[key] = val;
        // ToDo: implement a safe mode that would throw a preProcesser error if key is already defined.
        return mergeRight(wd, new_word);
    };
    // non-FP section (candidate for refactor)
    var next_pl = __spreadArrays(pl);
    var next_wd = {};
    var def_i = findIndex(function (word) { return word === 'compose'; }, next_pl);
    while (def_i !== -1) {
        if (def_i >= 2) {
            var word = toPLOrNull(next_pl[def_i - 2]);
            var key = toStringOrNull(head(toArrOrNull(next_pl[def_i - 1])));
            next_pl.splice(def_i - 2, 3); // splice is particularly mutant
            next_wd = defineWord(next_wd, key, { "compose": word });
        }
        def_i = findIndex(function (word) { return word === 'compose'; }, next_pl);
    }
    return [next_pl, mergeRight(coreWords, next_wd)];
};

// an interpreter that calls purr after parsing and preprocessing, so you dont have to
function interpreter(pl_in, opt) {
    if (opt === void 0) { opt = { logLevel: 0, yieldOnId: false }; }
    // the word dictionary 
    var wd_in = opt.wd ? opt.wd : coreWords;
    // the program list and word dictionary are preProcessed and parsed (if needed) 
    var _a = is(Array, pl_in) ? [toPLOrNull(pl_in), wd_in] : preProcessDefs(is(String, pl_in) ? parser(pl_in.toString()) : pl_in, wd_in), pl = _a[0], wd = _a[1];
    var maxCycles = opt.maxCycles || 100000;
    return purr(pl, wd, maxCycles);
}
// (more closer to a) production version interpreter
// Assumes that you have run and tested the interpreter with parsed pre processed input 
// opt:{ logLevel: 0, yieldOnId: false, preProcessed: true, wd: coreWords_merged_with_preProcessedDefs }
//
function purr(pl, wd, cycleLimit) {
    var s, cycles, w, wds, plist;
    var _a, _b;
    var _c;
    if (cycleLimit === void 0) { cycleLimit = 10000; }
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                s = [];
                cycles = 0;
                _d.label = 1;
            case 1:
                if (!(pl.length > 0)) return [3 /*break*/, 4];
                w = pl.shift();
                wds = is(String, w) ? wd[w] : null;
                if (wds) {
                    cycles += 1;
                    if (typeof wds.compose === 'function') {
                        _a = wds.compose(s, pl), s = _a[0], _b = _a[1], pl = _b === void 0 ? pl : _b;
                    }
                    else {
                        plist = toPLOrNull(wds.compose);
                        if (plist) {
                            pl.unshift.apply(pl, plist);
                        }
                    }
                }
                else if (w !== undefined && s !== null) {
                    if (is(Array, w)) {
                        s.push([].concat(w));
                    }
                    else {
                        s.push(w);
                    }
                }
                if (!(cycles >= cycleLimit)) return [3 /*break*/, 3];
                return [4 /*yield*/, { stack: [], prog: __spreadArrays(s, [w], pl), active: true }];
            case 2:
                cycleLimit = (_c = (_d.sent())) !== null && _c !== void 0 ? _c : 1000;
                cycles = 0;
                _d.label = 3;
            case 3: return [3 /*break*/, 1];
            case 4: return [2 /*return*/, { stack: s, prog: pl, active: false }];
        }
    });
}

var dtWords = {
    'guard': {
        compose: ["play"]
    },
    '=dt=': {
        compose: parser('[0 outAt] dip 0 outAt [swap] dip == [drop drop] dip')
    },
    'comp': {
        compose: parser("[true [[size 0 <=] dip swap] [[drop] dip] [[pop swap [==] dip swap] dip &&] [] linrec] dip [Error in composition of type] if-else")
    },
    'run': {
        compose: ["play"]
        // compose: parse('[size 0 <=] [drop] [uncons] [] linrec')
    },
    'bind': {
        compose: function (s, pl) {
            var fo = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            var fi = toArrOfStrOrNull(s === null || s === void 0 ? void 0 : s.pop());
            if (fo !== null && fi !== null) {
                var _loop_1 = function () {
                    var se = s.pop();
                    var e = fi.pop();
                    if (e === "A" || e === "C" || e === "D" || e === "E" || e === "F" || e === "G" || e === "H") {
                        fo = map(function (foe) { return foe === e ? se : foe; }, fo);
                    }
                };
                while (s.length > 0 && fi.length > 0) {
                    _loop_1();
                }
                if (fi.length === 0) {
                    // console.log("bind requeue fo", s, fo);
                    pl.unshift.apply(pl, fo);
                }
                else {
                    console.log("bind another day push 2 ", fi, fo, "comp");
                    s.push(fi, fo, "bind");
                }
                return [s, pl];
            }
            console.error("Type error 28");
            return [null];
        }
    }
};
var mbr2 = function (s, sig) {
    var initial = concat(s, sig);
    var typeExp1 = clone(initial);
    var allWords = __assign(__assign({}, dtWords), coreWords);
    var purrur = purr(initial, allWords);
    var typeExp2 = purrur.next().value.stack;
    var count = 0; // just incase there is a bad recursive type def
    // console.log("mbr ", count, typeExp1, typeExp2);
    while (count < 500 && !compareObjects(typeExp1, typeExp2)) {
        count++;
        // console.log("mbr ", count, typeExp1, typeExp2);
        initial = clone(typeExp2);
        typeExp1 = clone(typeExp2);
        purrur = purr(initial, allWords);
        typeExp2 = purrur.next().value.stack;
    }
    return typeExp2;
};
function typeConversion(orig_pl) {
    var pl = clone(orig_pl);
    var s = [];
    var w;
    while ((w = pl.shift()) !== undefined) {
        var wds = is(String, w) ? coreWords[w] : null;
        if (wds) {
            // console.log("TC w", w, "s", clone(s), wds?.dt);
            s.push.apply(s, parser(wds === null || wds === void 0 ? void 0 : wds.dt)[0]);
        }
        else if (w !== undefined && s !== null) {
            if (toNumOrNull(w) !== null) {
                s.push("N|" + toNumOrNull(w));
            }
            else if (toStringOrNull(w) !== null) {
                if (w === "comp" || w === "bind" || w === "run" || w === "drop" || w === "guard") {
                    s.push(w);
                }
                else {
                    s.push("S");
                }
            }
            else if (toBoolOrNull(w) !== null) {
                s.push("B");
            }
            else if (toArrOrNull(w) !== null) {
                s.push(typeConversion(w));
            }
            else {
                console.log("TBD handle word", w, "on stack", s);
            }
        }
    }
    return s;
}
function dtCheck(typed_pl) {
    return mbr2([], typed_pl);
}

// the Pounce language core module exposes these function
var parse = parser;
var unParse = unParser;
var interpreter$1 = interpreter;
var coreWordDictionary = coreWords;
var purr$1 = purr;
var preProcessDefines = preProcessDefs;
var dtcheck = dtCheck;
var typeConv = typeConversion;

export { coreWordDictionary, dtcheck, interpreter$1 as interpreter, parse, preProcessDefines, purr$1 as purr, typeConv, unParse };
