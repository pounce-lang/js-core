import { split, map } from 'ramda';

// pounce core
var parse = function (ps) { return split(' ', ps); };
var pounce = function (pl) { return ([[], map(function (p) { return p; }, pl)]); };

export { parse, pounce };
