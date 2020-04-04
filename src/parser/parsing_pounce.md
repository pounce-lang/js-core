## Pounce parser (Pinna) can be generated with canopy
$ npm install -g canopy

with a .peg file Pinna.peg run 
$ canopy --lang js Pinna.peg

## Testing the generated parser
$ node Pinna_tester.js