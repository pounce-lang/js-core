# Pounce-lang/js-core
Pounce is a small concatenative programming language.
The core of the language includes a parser and an interpreter (written in TypeScript).
A core dictionary of Pounce words (functions on a value stack) is included. This dictionary can be augmented or replaced with a custom, perhaps more efficient or expressive, dictionary.

also see: c-core and py-core, plus some demos under pounce-lang.

## about Pounce
Pounce follows in the footsteps of Joy, Factor, Cat and Kitten, in that it is, [Concatenative](https://concatenative.org/) and a ['stack-based' language](https://wiki.c2.com/?StackBasedLanguage). To summarize, Pounce has:
* code written in post-fix notation (yes it will feel backwards at first, but post-fix has advantages)
* very little syntax -- no parentheses, just 'words' or 'lists of words' separated by spaces (at first you might experience syntax withdrawal symptoms)
* no variables -- a stack is used to store values, (i.e. it's a mostly point-free, stack-based language) (see the word `pounce` for non-variable naming of stack elements)
* the nice property that "all words are functions!" including values (e.g the word `5`) where the identity function is used. 
* the same signature for all words -- they receive a stack as an argument and return a new stack
* no assignment operator and no side-effects (the program is the input and the final stack is the output)
* programs that are built up by composing words (rather than the application of functions to variable arguments), concatenative programming is essentially functional composition into a single function (or program)

## Quick Start
To start Pounce programming in the browser, you can [try this sampler](https://pounce-lang-show-case.netlify.app/). Or clone this [starter project template](https://github.com/pounce-lang/simple-example-app) and extend it how ever you see fit.

## Try it in RunKit
[RunKit https://runkit.com/embed/i6tu1bf90mz6](https://runkit.com/embed/i6tu1bf90mz6)
``` Javascript
// Run a small Pounce program that doubles 21.
// When logLevel > 0, intermediate states of the stack and program are displayed. 
var core = require("@pounce-lang/core")
var interp = core.interpreter(core.parse("21 dup +"), {logLevel:1});
var pounceState = interp.next();
while (pounceState.value.active) {
const stack = core.unParse(pounceState.value.stack);
const prog = core.unParse(pounceState.value.prog);
console.log(`${stack} | ${prog}`);
pounceState = interp.next();
}
console.log(pounceState.value.stack);
```
## to peek in on the code: clone, install, build and test
```
npm i
npm run build
```

and run the tests 
```
npm run test
```
