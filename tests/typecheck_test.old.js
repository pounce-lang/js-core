const pinna = require('../dist/index').parse;
const typecheck = require('../dist/index').preProcessCheckTypes;
const coreWords = require('../dist/index').coreWordDictionary;


let tests = [
    ['2', ["number_t"]],
    ['true', ["boolean_t"]],
    ['false', ["boolean_t"]],
    ['"abc"', ["string_t"]],
    ['2 3 +', ["number_t"]],
    ['2 3 + -4 +', ["number_t"]],
    // // ['2 abc +', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    // // ['twelve 12 +', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    ['hello world', ["string_t","string_t"]],
    ['"hello world"', ["string_t"]],
    ['2 3 -', ["number_t"]],
    // // ['2 abc -', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    // // ['twelve 12 -', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    ['2 3 *', ["number_t"]],
    ['2 3 * 6 -', ["number_t"]],
    // // ['2 abc *', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    // // ['twelve 12 *', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    ['2 3 /', ["number_t"]],
    // // ['2 abc /', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    // // ['twelve 12 /', [{"error":"An unexpected stack type of 'string' was encountered!","expectedType":"number","encounteredType":"string"}]],
    // // ['2 0 /', [{"error":"Guard found that the static value 0 failed to pass its requirement [0 !=]"}]],
    ['[]', [[]]],
    ['[][]', [[],[]]],
    ['[2 4 7]', [["number_t","number_t","number_t"]]],
    // ['[2 4 7]', [["number_t+"]]],
    ['[[]]', [[[]]]],
    ['[[[]]]', [[[[]]]]],
    ['[a[b b2]]', [["string_t", ["string_t", "string_t"]]]],
    ['[a[b b2]] 7', [["string_t", ["string_t", "string_t"]],"number_t"]],
    ['[a[b b2[c c2]d]e]', [["string_t", ["string_t", "string_t", ["string_t", "string_t"], "string_t"], "string_t"]]],
    ['[a[b b2]c c2[d]e]', [["string_t", ["string_t", "string_t"], "string_t", "string_t", ["string_t"], "string_t"]]],
    ['a 2 swap', ["number_t","string_t"]],
    ['a 2 swap dup', ["number_t","string_t","string_t"]],
    ['[a] 2 swap dup', ["number_t",["string_t"],["string_t"]]],
    ['3 2 a [+] dip', ["number_t","string_t"]],
    ['3 a [2 +] dip', ["number_t","string_t"]],
    ['d 2 a [swap] dip', ["number_t","string_t","string_t"]],    
        
    ['3 2 5 rotate', ["number_t", "number_t", "number_t"]],
    ['aa cc 3 rotate', ["number_t", "string_t", "string_t"]],
    ['3 2 "3" rollup', ["string_t", "number_t", "number_t"]],
    ['a 3.14 "c3p0" rolldown', ["number_t", "string_t", "string_t"]],
    ['2 a [dup] dip', ["number_t","number_t","string_t"]],
    ['[a] 3 dup2', [["string_t"],"number_t",["string_t"],"number_t"]],
    ['a 3 dup2', ["string_t", "number_t","string_t", "number_t"]],
    ['a 3 drop', ["string_t"]],
    ['a 3 [drop] dip', ["number_t"]],
    ['3 3 =', ["number_t","boolean_t"]],

    ['3 a [3 =] dip', ["number_t","boolean_t","string_t"]],
    ['a [3 3 =] dip', ["number_t","boolean_t","string_t"]],
    ['a [3 3 =] dip drop', ["number_t","boolean_t"]],
    ['5 5 ==', ["boolean_t"]],
    // // // ['5 a ==', ["type error in '==' must have matching types: number_t and string_t do not match"]],
    ['5 a [6 ==] dip', ["boolean_t","string_t"]],
    ['a [5 5 ==] dip', ["boolean_t","string_t"]],
    ['2 3 [+] play', ["number_t"]], 
    ['2 3 5 [+ +] play', ["number_t"]], 
    ['2 3 [[+] play] play', ["number_t"]], 
    ['2 3 [[[+] play] play] play', ["number_t"]], 
    ['2 [3 [[+] play] play] play', ["number_t"]], 
    ['2 [3 [+] play] play', ["number_t"]], 
    ['true [a] [b] if-else', ["string_t"]],
    ['3 true [1 +] [2 +] if-else', ["number_t"]],
    ['3 true [2 1 +] [3 2 +] if-else', ["number_t","number_t"]],
    ['3 true [4 1 +] [2 +] if-else', ["'if-else' type check error: then and else clauses types do not match",["number_t"],["-number_t","number_t"]]],
    ['true [a] [a] if-else', ["string_t"]],
    ['[true] [a] [a] ifte', ["string_t"]],
    ['2 +', ["-number_t", "number_t"]],
    ['4 3 true [1 +] [[8 +] dip 5 -] if-else', ["number_t","number_t"]],
    ['3 a ==', ["'==' type check error: stack elements types do not match",["string_t"],["number_t"]]],
    ['3 a =', ["'=' type check error: stack elements types do not match",["string_t"],["number_t"]]],
    ['true a 3 [drop] dip2', ["string_t", "number_t"]],
    ['0 1 [dup2 +] 5 times', [["*number_t"]]],
    // ['6 [3 8 5 7 10 2 9 1] [>] split', [["*number_t"],["*number_t"]]],

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
        // console.log("calling typeCheck with ", result_pl);
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


// const isCap = (s) => s.search(/[A-Z]/) === 0;
// console.log(isCap("A"));