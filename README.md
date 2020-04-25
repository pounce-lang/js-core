# Pounce-lang/core
Pounce is a small concatenative language that runs in Javascript.
The core of the language includes a parser and an interpreter called "purr". 
A core dictionary of Pounce words is included, but can be overridden with a custom, perhaps more efficient, dictionary of words.

## about Pounce
In the Pounce language:
* Code is written in post-fix notation (yes it will feel backwards at first, but post-fix has advantages).
* Very little syntax to learn. Just 'words' with spaces in between (at first you might have syntax withdrawal symptoms)
* A Stack is used to store values (i.e. it's a point-free, stack-based language with optional 'named local variables' for convenience)
* All words are functions, so that makes it a (perhaps atypical) 'functional' language.
* Programs are built up as a composition of functions (e.g typically f composed with g is written like this `f(g(stack))` but in Pounce, functions are composed by simply concatenation `g f`)

## Quick Start
To start Pounce programming in the browser, you can try this simple demonstration. You can also clone the code for the demo as a starting template. 

## Try it in RunKit
``` Javascript
// https://runkit.com/embed/iu9bh0yzz0ig
var core = require("@pounce-lang/core")
var interp = core.purr([21, "dup", "+"]);
var resp = interp.next();
while (!resp.done) {
  console.log(resp.value)
  resp = interp.next();
}
```
