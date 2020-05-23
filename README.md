# Pounce-lang/core
Pounce is a small concatenative programming language.
The core of the language includes a parser and an interpreter (written in JavaScript).
A core dictionary of Pounce functions (called 'Words') is included. This dictionary can be augmented or replaced with a custom, perhaps more efficient or expressive, dictionary of words.

## about Pounce
Pounce is inspired by Joy, Factor, Cat and Kitten, in that it is, [Concatenative](https://concatenative.org/) and a ['stack-based' language](https://wiki.c2.com/?StackBasedLanguage). To summarize, Pounce has:
* code written in post-fix notation (yes it will feel backwards at first, but post-fix has advantages)
* very little syntax -- no parentheses, only 'words' separated by spaces (at first you might experience syntax withdrawal symptoms)
* no variables -- a stack is used to store values, (i.e. it's a point-free, stack-based language)
* the nice property that "All words are functions!" (note that the identity function is used, for data types)
* no assignment operator -- no side-effects (the program is the input and the final stack is the output)
* programs that are built up by composing functions (rather than the application of functions to variable arguments, concatenative programming is the composition of functions)
* words (i.e. functions) that all have the same signature -- they receive a stack as an argument and return a new stack.

## Quick Start
To start Pounce programming in the browser, you can [try this demonstration](https://nmorse.github.io/pounce/js/try_pounce.html). You may also clone this [starter project template](https://github.com/pounce-lang/simple-example-app) and extend it how ever you see fix.

## Try it in RunKit
``` Javascript
// https://runkit.com/embed/y85aio9m2g1j
var core = require("@pounce-lang/core")
var interp = core.interpreter(core.parse("21 dup +"), undefined, {debug:true});
var pounceState = interp.next();
while (pounceState.value.active) {
const stack = core.unParse(pounceState.value.stack);
const prog = core.unParse(pounceState.value.prog);
console.log(`${stack} | ${prog}`);
pounceState = interp.next();
}
console.log(pounceState.value.stack);
```
