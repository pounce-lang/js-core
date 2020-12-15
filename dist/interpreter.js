var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as r from 'ramda';
import { coreWords, toPLOrNull, toStringOrNull, toNumOrNull } from './words/core';
import { parser as pinna } from './parser/Pinna';
import { preProcessDefs } from './preProcessDefs';
import { check, 
//    infer, match, 
parse as fbpTypeParse, } from "fbp-types";
var toTypeOrNull = function (val, type) {
    var t = fbpTypeParse(type);
    // console.log('*** t ***', t);
    // console.log('*** check(t, val) ***', check(t, val));
    if (check(t, val)) {
        if (type === 'string') {
            return toStringOrNull(val);
        }
        if (type === '(int | float)') {
            return toNumOrNull(val);
        }
    }
    return null;
};
var parse = pinna;
var debugLevel = function (ics, logLevel) { return (ics.length <= logLevel); };
// user debug sessions do not need to see the housekeeping words (e.g. popInternalCallStack) 
var debugCleanPL = function (pl) { return r.filter(function (w) { return (w !== "popInternalCallStack"); }, pl); };
// purr
export function interpreter(pl_in, opt) {
    var wd_in, internalCallStack, _a, pl, wd, s, _b, w, maxCycles, cycles, wds, _c, _d, s_ret, plist, _e, _f;
    var _g, _h;
    if (opt === void 0) { opt = { logLevel: 0, yieldOnId: false }; }
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                wd_in = opt.wd ? opt.wd : coreWords;
                internalCallStack = [];
                _a = r.is(Array, pl_in) ? [toPLOrNull(pl_in), wd_in] : preProcessDefs(r.is(String, pl_in) ? parse(pl_in.toString()) : pl_in, wd_in), pl = _a[0], wd = _a[1];
                s = [];
                if (!(opt === null || opt === void 0 ? void 0 : opt.logLevel)) return [3 /*break*/, 2];
                return [4 /*yield*/, { stack: s, prog: pl, active: true }];
            case 1:
                _b = _j.sent();
                return [3 /*break*/, 3];
            case 2:
                _b = null;
                _j.label = 3;
            case 3:
                _b;
                maxCycles = opt.maxCycles || 1000000;
                cycles = 0;
                _j.label = 4;
            case 4:
                if (!(cycles < maxCycles && internalCallStack.length < 1000
                    && (w = pl.shift()) !== undefined
                    && !((s === null || s === void 0 ? void 0 : s.length) === 1 && s[0] === null))) return [3 /*break*/, 17];
                cycles += 1;
                wds = r.is(String, w) ? wd[w] : null;
                if (!wds) return [3 /*break*/, 10];
                if (!(opt.logLevel && !opt.yieldOnId)) return [3 /*break*/, 8];
                if (!debugLevel(internalCallStack, opt.logLevel)) return [3 /*break*/, 6];
                return [4 /*yield*/, { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: __spreadArrays(internalCallStack) }];
            case 5:
                _d = _j.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = null;
                _j.label = 7;
            case 7:
                _c = _d;
                return [3 /*break*/, 9];
            case 8:
                _c = null;
                _j.label = 9;
            case 9:
                _c;
                if (typeof wds.compose === 'function') {
                    s_ret = null;
                    _g = wds.compose(s, pl), s = _g[0], _h = _g[1], pl = _h === void 0 ? pl : _h;
                    // if(r.isNil(s_ret)) {
                    //   cycles = maxCycles;
                    // }
                    // else {
                    //   s = s_ret;
                    // }
                }
                else {
                    if (w === "popInternalCallStack") {
                        internalCallStack.pop();
                    }
                    else {
                        plist = toPLOrNull(wds.compose);
                        if (plist) {
                            internalCallStack.push(toStringOrNull(w));
                            pl = __spreadArrays(plist, ["popInternalCallStack"], pl);
                        }
                    }
                }
                return [3 /*break*/, 16];
            case 10:
                if (!(w !== undefined)) return [3 /*break*/, 16];
                if (r.is(Array, w)) {
                    s === null || s === void 0 ? void 0 : s.push([].concat(w));
                }
                else {
                    s === null || s === void 0 ? void 0 : s.push(w);
                }
                if (!(opt.logLevel && opt.yieldOnId)) return [3 /*break*/, 14];
                if (!(debugLevel(internalCallStack, opt.logLevel))) return [3 /*break*/, 12];
                return [4 /*yield*/, { stack: s, prog: debugCleanPL([w].concat(pl)), active: true, internalCallStack: __spreadArrays(internalCallStack) }];
            case 11:
                _f = _j.sent();
                return [3 /*break*/, 13];
            case 12:
                _f = null;
                _j.label = 13;
            case 13:
                _e = _f;
                return [3 /*break*/, 15];
            case 14:
                _e = null;
                _j.label = 15;
            case 15:
                _e;
                _j.label = 16;
            case 16: return [3 /*break*/, 4];
            case 17:
                if (!((s === null || s === void 0 ? void 0 : s.length) === 1 && s[0] === null)) return [3 /*break*/, 19];
                console.log("s has null");
                return [4 /*yield*/, { stack: [], prog: pl, active: false, internalCallStack: __spreadArrays(internalCallStack), error: "a word did not find required data on the stack" }];
            case 18:
                _j.sent();
                _j.label = 19;
            case 19:
                if (!(cycles >= maxCycles || internalCallStack.length >= 1000)) return [3 /*break*/, 21];
                return [4 /*yield*/, { stack: s, prog: pl, active: false, internalCallStack: __spreadArrays(internalCallStack), error: "maxCycles or callStack size exceeded: this may be an infinite loop" }];
            case 20:
                _j.sent();
                _j.label = 21;
            case 21: return [4 /*yield*/, { stack: s, prog: pl, active: false }];
            case 22:
                _j.sent();
                return [2 /*return*/];
        }
    });
}
// (more closer to a) production version interpreter
// Assumes that you have run and tested the interpreter with parsed pre processed input 
// opt:{ logLevel: 0, yieldOnId: false, preProcessed: true, wd: coreWords_merged_with_preProcessedDefs }
//
export function purr(pl, wd, cycleLimit) {
    var s, w, cycles, wds, plist;
    var _a, _b;
    if (cycleLimit === void 0) { cycleLimit = 1000000; }
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                s = [];
                cycles = 0;
                while ((w = pl.shift()) !== undefined && cycles < cycleLimit) {
                    cycles += 1;
                    wds = r.is(String, w) ? wd[w] : null;
                    if (wds) {
                        if (typeof wds.compose === 'function') {
                            _a = wds.compose(s, pl), s = _a[0], _b = _a[1], pl = _b === void 0 ? pl : _b;
                        }
                        else {
                            plist = toPLOrNull(wds.compose);
                            if (plist) {
                                pl.unshift.apply(pl, plist);
                            }
                        }
                    }
                    else if (w !== undefined) {
                        if (r.is(Array, w)) {
                            s.push([].concat(w));
                        }
                        else {
                            s.push(w);
                        }
                    }
                }
                if (!(pl.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, { stack: [], prog: __spreadArrays(s, [w], pl), active: false, cyclesConsumed: cycles }];
            case 1:
                _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, { stack: s, prog: pl, active: false }];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}
export var introspectWords = function () { return r.keys(r.omit(['popInternalCallStack'], coreWords)); };
export var introspectWord = function (wn) { return JSON.parse(JSON.stringify(r.path([wn], coreWords))); };
export var preProcess = preProcessDefs;
