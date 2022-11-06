const pinna = require('../dist/index').parse;
const unparse = require('../dist/index').unParse;
const dtcheck = require('../dist/index').dtcheck;
const typeConv = require('../dist/index').typeConv;
const coreWords = require('../dist/index').coreWordDictionary;


let tests = [
    // ['2', 'N', 'N'],
    // ['true', 'B', 'B'],
    // ['false', 'B', 'B'],
    // ['"abc"', 'S', 'S'],
    // ['2 3 +', 'N N [N N] [N] comp', 'N'],
    // ['2 3 + -4 +', 'N N [N N] [N] comp N [N N] [N] comp', 'N'],
    // ['2 abc +', 'N S [N N] [N] comp', 'Error'],
    // ['twelve 12 +', 'S N [N N] [N] comp', 'Error'],
    // ['hello world', 'S S', 'S S'],
    // ['"hello world"', "S", "S"],
    // ['2 3 -', 'N N [N N] [N] comp', 'N'],
    // ['2 abc -', 'N S [N N] [N] comp', 'Error'],
    // ['twelve 12 -', 'S N [N N] [N] comp', 'Error'],
    // ['2 3 *', 'N N [N N] [N] comp', 'N'],
    // ['2 3 * 6 -', 'N N [N N] [N] comp N [N N] [N] comp', 'N'],
    // ['2 3 /', 'N N [N N] [N] comp', 'N'],
    // ['[]', '[]', '[]'],
    // ['[][]', '[] []', '[] []'],
    // ['[2 4 7]', '[N N N]', '[N N N]'],
    // ['[[]]', '[[]]', '[[]]'],
    // ['[[[]]]', '[[[]]]', '[[[]]]'],
    // ['[a[b b2]]', '[S [S S]]', '[S [S S]]'],
    // ['[a[b b2]] 7', '[S [S S]] N', '[S [S S]] N'],
    // ['[a[b b2[c c2]d]e]', '[S [S S [S S] S] S]', '[S [S S [S S] S] S]'],
    // ['[a[b b2]c c2[d]e]', '[S [S S] S S [S] S]', '[S [S S] S S [S] S]'],
    // ['a 2 swap', 'S N [C D] [D C] bind', 'N S'],
    // ['a 2 dup', 'S N [A] [A A] bind', 'S N N'],
    // ['a 2 swap dup', 'S N [C D] [D C] bind [A] [A A] bind', 'N S S'],
    // ['[a] 2 swap dup', '[S] N [C D] [D C] bind [A] [A A] bind', 'N [S] [S]'],
    // ['3 2 a [+] dip', 'N N S [[N N] [N] comp] [A F] [F run A] bind', 'N S'],
    // ['3 a [2 +] dip', 'N S [N [N N] [N] comp] [A F] [F run A] bind', 'N S'],
    // ['d 2 a [swap] dip', 'S N S [[C D] [D C] bind] [A F] [F run A] bind', 'N S S'],
    // ['true a 5 rotate', 'B S N [C D E] [E D C] bind', 'N S B'],
    // ['aa cc 3 rotate', 'S S N [C D E] [E D C] bind', 'N S S'],
    // ['3 true "3" rollup', 'N B S [C D E] [E C D] bind', 'S N B'],
    // ['false 3.14 "c3p0" rolldown', 'B N S [C D E] [D E C] bind', 'N S B'],
    // ['2 a [dup] dip', 'N S [[A] [A A] bind] [A F] [F run A] bind', 'N N S'],
    // ['[a] 3 dup2', '[S] N [C D] [C D C D] bind', '[S] N [S] N'],
    // ['a 3 dup2', 'S N [C D] [C D C D] bind', 'S N S N'],
    // ['a 3 drop', 'S N [A] [] bind', 'S'],
    // ['a 3 [drop] dip', 'S N [[A] [] bind] [A F] [F run A] bind', 'N'],
    // ['3 3 =', 'N N [N N] [N B] comp', 'N B'],
    // ['3 a [3 =] dip', 'N S [N [N N] [N B] comp] [A F] [F run A] bind', 'N B S'],
    // ['a [3 3 =] dip', 'S [N N [N N] [N B] comp] [A F] [F run A] bind', 'N B S'],
    // ['a [3 3 =] dip drop', 'S [N N [N N] [N B] comp] [A F] [F run A] bind [A] [] bind', 'N B'],
    // ['5 5 ==', 'N N [N N] [B] comp', 'B'],
    // ['5 a ==', 'N S [N N] [B] comp', 'Error'],
    // ['5 a [6 ==] dip', 'N S [N [N N] [B] comp] [A F] [F run A] bind', 'B S'],
    // ['a [5 5 ==] dip', 'S [N N [N N] [B] comp] [A F] [F run A] bind', 'B S'],
    // ['2 3 [+] play', 'N N [[N N] [N] comp] [F] [F run] bind', 'N'],
    // ['2 3 5 + +', 'N N N [N N] [N] comp [N N] [N] comp', 'N'],
    // ['2 3 5 [+ +] play', 'N N N [[N N] [N] comp [N N] [N] comp] [F] [F run] bind', 'N'],
    
    // ['1 2 3 [5 + [2 + 6 *] dip] dip', 'N N N [N [N N] [N] comp [N [N N] [N] comp N [N N] [N] comp] [A F] [F run A] bind] [A F] [F run A] bind', 'N N N'],
    // ['2 3 [[+] play] play', 'N N [[[N N] [N] comp] [F] [F run] bind] [F] [F run] bind', 'N'],
    // ['2 3 [[[+] play] play] play', 'N N [[[[N N] [N] comp] [F] [F run] bind] [F] [F run] bind] [F] [F run] bind', 'N'],
    // ['2 [3 [[+] play] play] play', 'N [N [[[N N] [N] comp] [F] [F run] bind] [F] [F run] bind] [F] [F run] bind', 'N'],
    // ['2 [3 [+] play] play', 'N [N [[N N] [N] comp] [F] [F run] bind] [F] [F run] bind', 'N'],
    // ['true [a] [b] if-else', 'B [S] [S] [B F F] [F run] bind', 'S'],
    // ['3 true [1 +] [2 +] if-else', 'N B [N [N N] [N] comp] [N [N N] [N] comp] [B F F] [F run] bind', 'N'],
    // ['3 true [2 1 +] [3 2 +] if-else', 'N B [N N [N N] [N] comp] [N N [N N] [N] comp] [B F F] [F run] bind', 'N N'],
    // // ['3 true [4 1 +] [2 +] if-else', 'N B [N N [N N] [N] comp] [N [N N] [N] comp] [B F F] [F run] bind', 'Error: then-else clause missmatch'],
    // ['false [a] [a] if-else', 'B [S] [S] [B F F] [F run] bind', 'S'],
    // ['[true] [a] [a] ifte', '[B] [S] [S] [F G G] [F run G G] bind [B F F] [F run] bind', 'S'],
    // ['true [true &&] play', 'B [B [B B] [B] comp] [F] [F run] bind', 'B'],
    // ['true [true &&] [a] [a] ifte', 'B [B [B B] [B] comp] [S] [S] [F G G] [F run G G] bind [B F F] [F run] bind', 'S'],
    // ['2 +', 'N [N N] [N] comp', 'Error'], // ??
    // ['4 3 true [1 +] [1 -] if-else', 'N N B [N [N N] [N] comp] [N [N N] [N] comp] [B F F] [F run] bind', 'N N'],
    // ['4 3 [8 +] dip 5 -', 'N N [N [N N] [N] comp] [A F] [F run A] bind N [N N] [N] comp', 'N N'],
    // ['4 a [8 +] dip', 'N S [N [N N] [N] comp] [A F] [F run A] bind', 'N S'],
    // ['true a 3 [drop] dip2', 'B S N [[A] [] bind] [A C F] [F run A C] bind', 'S N'],
    // ['4 3 [[8 +] dip] play', 'N N [[N [N N] [N] comp] [A F] [F run A] bind] [F] [F run] bind', 'N N'],
    // ['4 3 [5 - [8 +] dip] play', 'N N [N [N N] [N] comp [N [N N] [N] comp] [A F] [F run A] bind] [F] [F run] bind', 'N N'],
    // ['4 3 [[8 +] dip 5 -] play', 'N N [[N [N N] [N] comp] [A F] [F run A] bind N [N N] [N] comp] [F] [F run] bind', 'N N'],

    // ['4 3 true [1 +] [[8 +] dip 5 -] if-else', 'N N B [N [N N] [N] comp] [[N [N N] [N] comp] [A F] [F run A] bind N [N N] [N] comp] [B F F] [F run] bind', 'N N'],
    // ['3 a ==', 'N S [N N] [B] comp', 'Error'],
    // ['3 a =', 'N S [N N] [N B] comp', 'Error'],
    // ['0 1 [dup2 +] 5 times', 'N N [[C D] [C D C D] bind [N N] [N] comp] N F N', 'N N [[C D] [C D C D] bind [N N] [N] comp] N F N'],
    // // ['6 [3 8 5 7 10 2 9 1] [>] split', '', '[*N] [*N]'],
    ['2 0 /', 'N|2 N|0 [N N] [N] comp [N|0 !=] guard', 'Error in composition of type'] // 'Error: Guard found [N|0 !=] violation'],
];


console.log('Starting type check tests:');
let testCount = 0;
let testsFailed = 0;
tests.forEach((test, i) => {
    const ps = test[0];
    const expect_interim = test[1];
    const expected_stack = test[2];

    // console.log(`starting parse test for: '${ps}'`);
    try {
        //parse then typecheck
        const parsed_pl = pinna(ps);
        // console.log("calling typeConversion with ", parsed_pl);
        const tc_interim = typeConv(parsed_pl, coreWords);
        // console.log(unparse(tc_interim)); 
        testCount += 1;
        if (!deepCompare(unparse(tc_interim), expect_interim)) {
            testsFailed += 1;
            console.log(unparse(tc_interim), ' expected interim:', expect_interim);
            console.log('---- Failed interim typecheck test for: ', ps);
        }
        else {
            //console.log("passed interim ", expect_interim);
            tests[i][3] = true;
            console.log("tc_interim", tc_interim);
            const tc_stack = dtcheck(tc_interim);
            console.log("tc_stack", tc_stack);
            if (!deepCompare(unparse(tc_stack), expected_stack)) {
                testsFailed += 1;
                console.log(unparse(tc_stack), ' expected stack:', expected_stack);
                console.log('---- Failed stack typecheck test for: ', ps);
            }
        }
    }
    catch (e) {
        if (tests[i][1][0] !== "type error") {
            tests[i][3] = false;
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