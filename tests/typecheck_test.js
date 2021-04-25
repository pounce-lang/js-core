const pinna = require('../dist/index').parse;
const typecheck = require('../dist/index').preProcessCheckTypes;
const coreWords = require('../dist/index').coreWordDictionary;


let tests = [
    ['2', [{"type":"number","w":"2"}]],
    ['2 3 +', [{"type":"number","w":"+"}]],
    ['2 abc +', [{"error":"An unexpected stack type of string with value 'abc' was encountered by +","word":"+","stackDepth":0,"expectedType":"number","encounteredType":"string","encounterdValue":"abc"}]],
    ['twelve 12 +', [{"error":"An unexpected stack type of string with value 'twelve' was encountered by +","word":"+","stackDepth":1,"expectedType":"number","encounteredType":"string","encounterdValue":"twelve"}]],
    ['hello world', [{"type":"string","w":"hello"},{"type":"string","w":"world"}]],
    ['"hello world"', [{"type":"string","w":"hello world"}]],
    ['2 3 -', [{"type":"number","w":"-"}]],
    ['2 abc -', [{"error":"An unexpected stack type of string with value 'abc' was encountered by -","word":"-","stackDepth":0,"expectedType":"number","encounteredType":"string","encounterdValue":"abc"}]],
    ['twelve 12 -', [{"error":"An unexpected stack type of string with value 'twelve' was encountered by -","word":"-","stackDepth":1,"expectedType":"number","encounteredType":"string","encounterdValue":"twelve"}]],
    ['2 3 *', [{"type":"number","w":"*"}]],
    ['2 3 * 6 -', [{"type":"number","w":"-"}]],
    ['2 abc *', [{"error":"An unexpected stack type of string with value 'abc' was encountered by *","word":"*","stackDepth":0,"expectedType":"number","encounteredType":"string","encounterdValue":"abc"}]],
    ['twelve 12 *', [{"error":"An unexpected stack type of string with value 'twelve' was encountered by *","word":"*","stackDepth":1,"expectedType":"number","encounteredType":"string","encounterdValue":"twelve"}]],
    ['2 3 /', [{"type":"number","w":"/"}]],
    ['2 abc /', [{"error":"An unexpected stack type of string with value 'abc' was encountered by /","word":"/","stackDepth":0,"expectedType":"number","encounteredType":"string","encounterdValue":"abc"}]],
    ['twelve 12 /', [{"error":"An unexpected stack type of string with value 'twelve' was encountered by /","word":"/","stackDepth":1,"expectedType":"number","encounteredType":"string","encounterdValue":"twelve"}]],
    ['2 0 /', [{"error":"Guard found that the static value 0 failed to pass its requirement [0 !=]"}]],
    ['[]', [{"type":"[]","w":"[]"}]],
    ['[][]', [{"type":"[]","w":"[]"},{"type":"[]","w":"[]"}]],
    ['[1 2 3]', [{"type":"[{type:number w:1} {type:number w:2} {type:number w:3}]","w":"[1 2 3]"}]],
    ['[[]]', [{"type":"[{type:[] w:[]}]","w":"[[]]"}]],
    ['[[[]]]', [{"type":"[{type:[{type:[] w:[]}] w:[[]]}]","w":"[[[]]]"}]],
    ['[a[b b2]]', [{"type":"[{type:string w:a} {type:[{type:string w:b} {type:string w:b2}] w:[b b2]}]","w":"[a [b b2]]"}]],
    ['[a[b b2]] 7', [{"type":"[{type:string w:a} {type:[{type:string w:b} {type:string w:b2}] w:[b b2]}]","w":"[a [b b2]]"},{"type":"number","w":"7"}]],
    // ['[a[b b2[c c2]d]e]', [{"type":"[string, [string, string, string[2], string], string]","w":"[a [b b2 [c c2] d] e]"}]],
    // ['[[][]]', [{"type":"[][2]","w":"[[] []]"}]],
    // ['[a[b b2]c c2[d]e]', [{"type":"[string, string[2], string, string, string[1], string]","w":"[a [b b2] c c2 [d] e]"}]],
];

function cmpLists(a, b) {
    let same = true;
    if (a.length === b.length) {
        a.forEach((a_ele, i) => {
            if (a[i] !== b[i]) {
                same = false;
            }
        });
    }
    else {
        same = false;
    }
    return same;
}

console.log('Starting type check tests:');
let testCount = 0;
let testsFailed = 0;
tests.forEach((test, i) => {
    const ps = test[0];
    const expected_stack = test[1];

    // console.log(`starting parse test for: '${ps}'`);
    try {
        //parse then typecheck
        const result_pl = pinna(ps);
        const tc_result = typecheck(result_pl, coreWords);
        testCount += 1;
        if (!deepCompare(tc_result, expected_stack)) {
            testsFailed += 1;
            console.log(JSON.stringify(tc_result), ' expected:', expected_stack);
            console.log('---- Failed typecheck test for: ', ps);
            tests[i][2] = false;
            tests[i][3] = tc_result;
        }
        else {
            tests[i][2] = true;
        }
    }
    catch (e) {
        if (tests[i][1][0] !== "type error") {
            tests[i][2] = false;
            testsFailed += 1;
            console.log(`Type error in: '${tests[i][0]}' Exception: ${e}`);
        }
    }
});

if (testsFailed === 0) {
    console.log('All', testCount, 'tests passed.');
}

function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw new Error("Need two or more arguments to compare");
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}