# Pounce-lang/core
Pounce is a small concatenative language that runs in Javascript.
The core of the language includes a parser called "pinna" and an interpreter called "purr". A core dictionary of Pounce words is included, but can be overridden with a custom, perhaps more efficient, dictionary of words.

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
