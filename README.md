# Pounce-lang/js-core
Pounce is a small concatenative programming language, developed mostly because there was no easy to use version of [Joy-lang](https://hypercubed.github.io/joy/html/j06prg.html).
This implementation of the language includes a parser and an interpreter (called js-core, but written in TypeScript) (also see: c-core and py-core for microprocessor versions implemented in "C" and "Python").
A core dictionary of Pounce words ("words" in concatenative parlance are "pure functions") can be augmented or replaced with a custom, perhaps more efficient, expressive or both, dictionary.

A demo is [here](https://pounce-lang-show-case.netlify.app/).

## about Pounce
Pounce follows in the footsteps of Forth, Joy, Cat and Kitten, in that it is, [Concatenative](https://concatenative.org/) and a ['stack-based' language](https://wiki.c2.com/?StackBasedLanguage). To summarize, Pounce has:
* code written in post-fix notation (yes it will feel backwards at first, but post-fix has advantages)
* very little syntax -- no parentheses, just 'words' or 'lists of words' separated by spaces, no commas (at first you might experience syntax withdrawal symptoms)
* no named variables -- a stack is used to store values, (i.e. it's a mostly point-free, stack-based language) (see the Pounce words `crouch` and `pounce` for some immutable, naming of stack values)
* the nice property that "all words are functions!" Even values (e.g the word `5`) are their own identity function, so `5` is a function that returns 5. 
* the same signature for all words -- they receive a stack as an argument and return a new stack
* no assignment operator and no side-effects (the program is the input and the final stack is the output)
* programs are built up by composing words (rather than the application of functions to variable arguments), concatenative programming is essentially functional composition (taken to an extreem). It can be viewed as all the words in your program being composed into a single function.

## Quick Start
To start Pounce programming in the browser, you can [try this sampler](https://pounce-lang-show-case.netlify.app/). or `npm install @pounce-lang/js-core` into a JS/TS project. 

## Try it in RunKit 
[RunKit https://runkit.com/embed/rq1ez0jvgfsh](https://runkit.com/embed/rq1ez0jvgfsh)
``` Javascript
// Run a small Pounce program that doubles 21.
// When logLevel > 0, intermediate states of the stack and program are displayed. 
var core = require("node_modules/@pounce-lang/core")
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
## to peek in on the code, build and test: clone this repo, then
```
npm i
npm run build
```

### and run the tests 
```
npm run test
```
