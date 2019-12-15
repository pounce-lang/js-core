'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var r = require('ramda');

// pounce core
var pounce = function (ps) { return r.split(' ', ps); };

exports.pounce = pounce;
