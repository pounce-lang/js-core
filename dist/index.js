'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var r = require('ramda');

var words = {
    swap: {
        expects: [{ desc: 'some item', ofType: 'any' }, { desc: 'another item', ofType: 'any' }],
        effects: [0],
        tests: [],
        desc: 'swap the top two elements on the stack',
        definition: function (s, pl, ws) {
            var a = s.pop();
            var b = s.pop();
            s.push(a, b);
            return [s, pl, ws];
        }
    }
    // // 'halt': {
    // //     expects: [], effects: [], tests: [], desc: 'halts a running program',
    // //     definition: (s: Json[]) => {
    // //         halt = true;
    // //         return [s];
    // //     }
    // // },
    // // 'def': {
    // //     expects: [{ ofType: 'list', desc: 'composition of words' }, { ofType: 'list', desc: 'name of this new word' }], effects: [-2], tests: [], desc: 'defines a word',
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const key = toString(s.pop());
    // //         const definition = s.pop();
    // //         wordstack[0][key] = definition;
    // //         return [s];
    // //     }
    // // },
    // // 'define': {
    // //     expects: [{ ofType: 'record', desc: 'definition of word' }, { ofType: 'string', desc: 'word name' }], effects: [-2], tests: [], desc: 'defines a word given a record',
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const name = toString(s.pop());
    // //         wordstack[0][name] = s.pop();
    // //         return [s];
    // //     }
    // // },
    // // 'local-def': {
    // //     expects: [{ ofType: 'list', desc: 'composition of words' }, { ofType: 'list', desc: 'name of this new word' }], effects: [-2], tests: [], desc: 'defines a local word',
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const top = wordstack.length - 1;
    // //         if (top > 0) {
    // //             const key = toString(s.pop());
    // //             const definition = s.pop();
    // //             wordstack[top][key] = definition;
    // //         }
    // //         return [s];
    // //     }
    // // },
    // // 'internal=>drop-local-words': {
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         wordstack.pop();
    // //         return [s];
    // //     }
    // // },
    // // 'import': {
    // //     definition: function (s: Json[], pl: PL, wordstack: Dictionary[]) {
    // //         const importable = toString(s.pop());
    // //         if (typeof importable === 'string') {
    // //             if (imported[importable]) {
    // //                 // already imported
    // //                 return [s];
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
    // //         return [s];
    // //     }
    // // },
    // // 'apply': {
    // //     expects: [{ desc: 'a runable', ofType: 'list' }], effects: [-1], tests: [], desc: 'run the contents of a list',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const block = s.pop();
    // //         if (isArray(block)) {
    // //             pl = block.concat(pl);
    // //         }
    // //         else {
    // //             pl.unshift(block);
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'dip': {
    // //     expects: [{ desc: 'a', ofType: 'list' }], effects: [-1], tests: [], desc: 'apply under the top of the stack (see apply)',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const block = s.pop();
    // //         const item = s.pop();
    // //         pl = [item].concat(pl);
    // //         if (isArray(block)) {
    // //             pl = block.concat(pl);
    // //         }
    // //         else {
    // //             pl.unshift(block);
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'dip2': {
    // //     expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [], desc: 'apply two under the top of the stack (see apply)',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const block = s.pop();
    // //         const item1 = s.pop();
    // //         const item2 = s.pop();
    // //         pl = [item1].concat(pl);
    // //         pl = [item2].concat(pl);
    // //         if (isArray(block)) {
    // //             pl = block.concat(pl);
    // //         }
    // //         else {
    // //             pl.unshift(block);
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'log': {
    // //     definition: (s: Json[]) => {
    // //         console.log(s);
    // //         return [s];
    // //     }
    // // },
    // // 'drop': {
    // //     expects: [{ desc: 'some value', ofType: 'any' }], effects: [-1], tests: [], desc: 'remove one element from the top of the stack',
    // //     definition: function (s: Json[]) {
    // //         s.pop();
    // //         return [s];
    // //     }
    // // },
    // // 'dup': {
    // //     expects: [{ desc: 'some item', ofType: 'any' }], effects: [1], tests: [], desc: 'duplicate the top element on the stack',
    // //     definition: function (s: Json[]) {
    // //         const top = s.length - 1;
    // //         const a = cloneItem(s[top]);
    // //         s.push(a);
    // //         return [s];
    // //     }
    // // },
    // // 'dup2': {
    // //     expects: [{ desc: 'some item', ofType: 'any' }, { desc: 'another item', ofType: 'any' }], effects: [2], tests: [], desc: 'duplicate the top two elements on the stack',
    // //     definition: [['dup'], 'dip', 'dup', ['swap'], 'dip']
    // //     //function (s: Json[]) {
    // //     //  const top = s.length - 1;
    // //     //  const a = cloneItem(s[top]);
    // //     //  const b = cloneItem(s[top - 1]);
    // //     //  s.push(b, a);
    // //     //  return [s];
    // //     //}
    // // },
    // // '+': {
    // //     expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'addition',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a + b);
    // //         return [s];
    // //     }
    // // },
    // // '-': {
    // //     expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'subtraction',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a - b);
    // //         return [s];
    // //     }
    // // },
    // // '/': {
    // //     expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'division',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a / b);
    // //         return [s];
    // //     }
    // // },
    // // '%': {
    // //     expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'modulo',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a % b);
    // //         return [s];
    // //     }
    // // },
    // // '*': {
    // //     expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'multiplication',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a * b);
    // //         return [s];
    // //     }
    // // },
    // // 'random': {
    // //     definition: function (s: Json[]) {
    // //         s.push(Math.random());
    // //         return [s];
    // //     }
    // // },
    // // 'round': {
    // //     definition: function (s: Json[]) {
    // //         const pres = s.pop();
    // //         const n = s.pop();
    // //         s.push(Math.round(n / pres) * pres);
    // //         return [s];
    // //     }
    // // },
    // // 'abs': {
    // //     definition: function (s: Json[]) {
    // //         const n = s.pop();
    // //         s.push(Math.abs(n));
    // //         return [s];
    // //     }
    // // },
    // // 's2int': {
    // //     expects: [{ desc: 'a number in a string', ofType: 'string' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s.pop();
    // //         const str = toString(s.pop());
    // //         s.push(Number.parseInt(str, radix));
    // //         return [s];
    // //     }
    // // },
    // // 'int2s': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'radix', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const radix = s.pop();
    // //         const n = s.pop();
    // //         s.push(n.toString(radix));
    // //         return [s];
    // //     }
    // // },
    // // '<<': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n << shift);
    // //         return [s];
    // //     }
    // // },
    // // '>>': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n >> shift);
    // //         return [s];
    // //     }
    // // },
    // // 'XOR': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n ^ shift);
    // //         return [s];
    // //     }
    // // },
    // // 'AND': {
    // //     expects: [{ desc: 'number', ofType: 'integer' }, { desc: 'shift', ofType: 'integer' }],
    // //     definition: function (s: Json[]) {
    // //         const shift = s.pop();
    // //         const n = s.pop();
    // //         s.push(n & shift);
    // //         return [s];
    // //     }
    // // },
    // // 'store.set': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         localStorage.setItem(name, JSON.stringify(s.pop()));
    // //         return [s];
    // //     }
    // // },
    // // 'store.get': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         s.push(JSON.parse(localStorage.getItem(name)));
    // //         return [s];
    // //     }
    // // },
    // // 'store.remove': {
    // //     definition: function (s: Json[]) {
    // //         const name = toString(s.pop());
    // //         localStorage.removeItem(name);
    // //         return [s];
    // //     }
    // // },
    // // 'depth': {
    // //     expects: [], effects: [1], tests: [], desc: 'stack depth',
    // //     definition: function (s: Json[], pl: PL) {
    // //         s.push(s.length);
    // //         return [s];
    // //     }
    // // },
    // // '==': {
    // //     expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'compare for equality',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a === b);
    // //         return [s];
    // //     }
    // // },
    // // '>': {
    // //     expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'greater than',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a > b);
    // //         return [s];
    // //     }
    // // },
    // // '>=': {
    // //     expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'greater than or equal',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a >= b);
    // //         return [s];
    // //     }
    // // },
    // // '<': {
    // //     expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'less than',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a < b);
    // //         return [s];
    // //     }
    // // },
    // // '<=': {
    // //     expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'less than or equal',
    // //     definition: function (s: Json[]) {
    // //         const b = s.pop();
    // //         const a = s.pop();
    // //         s.push(a <= b);
    // //         return [s];
    // //     }
    // // },
    // // 'and': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical and',
    // //     definition: function (s: Json[]) {
    // //         const b = toBoolean(s.pop());
    // //         const a = toBoolean(s.pop());
    // //         s.push(a && b);
    // //         return [s];
    // //     }
    // // },
    // // 'or': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical or',
    // //     definition: function (s: Json[]) {
    // //         const b = toBoolean(s.pop());
    // //         const a = toBoolean(s.pop());
    // //         s.push(a || b);
    // //         return [s];
    // //     }
    // // },
    // // 'not': {
    // //     expects: [{ desc: 'a', ofType: 'boolean' }], effects: [0], tests: [], desc: 'logical not',
    // //     definition: function (s: Json[]) {
    // //         const a = toBoolean(s.pop());
    // //         s.push(!a);
    // //         return [s];
    // //     }
    // // },
    // // 'bubble-up': {
    // //     'requires': 'list_module',
    // //     'named-args': ['c'],
    // //     'local-words': {
    // //     },
    // //     'definition': [[], ['cons'], 'c', 'repeat', 'swap', [['uncons'], 'c', 'repeat', 'drop'], 'dip']
    // // },
    // // 'repeat': {
    // //     // 'requires':'list_module',
    // //     'definition': ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'repeat'], ['drop', 'drop'], 'if-else']
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
    // // 'if': {
    // //     expects: [{ desc: 'conditional', ofType: 'boolean' }, { desc: 'then clause', ofType: 'list' }], effects: [-2], tests: [], desc: 'conditionally apply a quotation',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const then_block = s.pop();
    // //         const expression = toBoolean(s.pop());
    // //         if (expression) {
    // //             if (isArray(then_block)) {
    // //                 pl = then_block.concat(pl);
    // //             }
    // //             else {
    // //                 pl.unshift(then_block);
    // //             }
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'if-else': {
    // //     expects: [{ desc: 'conditional', ofType: 'boolean' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally apply the first or second quotation',
    // //     definition: function (s: Json[], pl: PL) {
    // //         const else_block = s.pop();
    // //         const then_block = s.pop();
    // //         const expression = toBoolean(s.pop());
    // //         if (expression) {
    // //             if (isArray(then_block)) {
    // //                 pl = then_block.concat(pl);
    // //             }
    // //             else {
    // //                 pl.unshift(then_block);
    // //             }
    // //         }
    // //         else {
    // //             if (isArray(else_block)) {
    // //                 pl = else_block.concat(pl);
    // //             }
    // //             else {
    // //                 pl.unshift(else_block);
    // //             }
    // //         }
    // //         return [s, pl];
    // //     }
    // // },
    // // 'ifte': {
    // //     expects: [{ desc: 'conditional', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally apply the first or second quotation',
    // //     definition: [['apply'], 'dip2', 'if-else']
    // // },
    // // 'floor': ['dup', 1, '%', '-'],
    // // 'rollup': {
    // //     expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rollup', ['C', 'A', 'B']], desc: 'roll up 3 elements on the stack, the top item ends up under the other two',
    // //     definition: ['swap', ['swap'], 'dip']
    // // },
    // // 'rolldown': {
    // //     expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rolldown', ['B', 'C', 'A']], desc: 'roll down 3 elements in the stack, the bottom item ends up at the top',
    // //     definition: [['swap'], 'dip', 'swap']
    // // },
    // // 'rotate': {
    // //     expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rotate', ['C', 'B', 'A']], desc: 'inverts the order of the top three elements',
    // //     definition: ['swap', ['swap'], 'dip', 'swap']
    // // },
    // // 'map-under': {
    // //     'requires': 'list_module',
    // //     'named-args': ['c', 'q'],
    // //     'local-words': {
    // //         'init-a': [[[]], ['a'], 'local-def'],
    // //         'update-a': ['a', 'cons', [], 'cons', ['a'], 'local-def'],
    // //         'destructive-first': ['c', 'pop', 'swap', [], 'cons', ['c'], 'local-def'],
    // //         'maping': ['c', 'list-length', 0, '>',
    // //             ['destructive-first', 'q', 'apply', 'update-a', 'maping'],
    // //             [], 'if-else']
    // //     },
    // //     'definition': ['init-a', 'maping', 'a']
    // // },
    // // 'map': {
    // //     'local-words': {
    // //         'setup-map': [[]],
    // //         'process-map': [
    // //             ['dup', 'list-length'], 'dip2', 'rolldown', 0, '>',
    // //             ['rotate', 'pop', 'rolldown', 'dup', ['apply'], 'dip', ['swap'], 'dip2', ['prepend'], 'dip', 'swap', 'process-map'],
    // //             [['drop', 'drop'], 'dip'], 'if-else']
    // //     },
    // //     'definition': ['list_module', 'import', 'setup-map', 'process-map']
    // // },
    // // 'filter': {
    // //     'requires': 'list_module',
    // //     'local-words': {
    // //         'setup-filter': [[]],
    // //         'process-filter': [
    // //             ["dup", "list-length"], "dip2", "rolldown", 0, ">",
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
    // //         'more?': ['rolldown', 'dup', 'list-length', 0, '>', ['rollup'], 'dip'],
    // //         'process-reduce': ['more?', ['reduce-step', 'process-reduce'], 'if'],
    // //         'reduce-step': [['pop'], 'dip2', 'dup', [['swap'], 'dip', 'apply'], 'dip'],
    // //         'teardown-reduce': ['drop', ['drop'], 'dip'],
    // //     },
    // //     'definition': ['process-reduce', 'teardown-reduce']
    // // }
};

// pounce core
var coreWords = words;
var hasWord = function (k) { return function (o) { return r.complement(r.isNil)(r.prop(k)(o)); }; };
var runWord = function (term, wd, pl, stack, wordstack) {
    if (r.is(Array, wd)) {
        console.log(term);
        var newPl = r.prepend(wd[0], pl);
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
};
var parse = function (ps) { return r.split(' ', ps); };
var pounce = function (pl, stack, wordstack) {
    if (pl.length > 0) {
        var term = r.head(pl);
        var restPl = r.tail(pl);
        if (r.is(Array, term)) {
            return pounce(restPl, r.append(term, stack), wordstack);
        }
        else if (r.is(String, term)) {
            var termStr = term.toString();
            console.log(term);
            var thisWord = r.findLast(hasWord(termStr))(wordstack);
            console.log('*** thisWord', thisWord);
            var thisWD = r.prop(termStr);
            console.log('*** thisWD', thisWD(thisWord));
            if (thisWord && r.complement(r.isNil)(thisWD(thisWord))) {
                var _a = runWord(termStr, thisWD(thisWord), stack, pl, wordstack), nextPl = _a[0], nextStack = _a[1], nextWordStack = _a[2];
                return pounce(nextPl, nextStack, nextWordStack);
            }
            else {
                return pounce(restPl, r.append(term, stack), wordstack);
            }
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

exports.coreWords = coreWords;
exports.parse = parse;
exports.pounce = pounce;
