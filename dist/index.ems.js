/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __generator(thisArg, body) {
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
}

// Pounce core engine is purr thanks EL for naming that.
function purr(programList, wd, opt) {
    var pl, vstack, w, maxWordsProcessed, wordsProcessed, wds;
    if (opt === void 0) { opt = { debug: true }; }
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                pl = programList || [];
                vstack = [];
                return [4 /*yield*/, ((_a = opt) === null || _a === void 0 ? void 0 : _a.debug) ? [vstack, pl] : null];
            case 1:
                _d.sent();
                maxWordsProcessed = 100;
                wordsProcessed = 0;
                _d.label = 2;
            case 2:
                if (!(wordsProcessed < maxWordsProcessed && (w = pl.shift()))) return [3 /*break*/, 7];
                wordsProcessed += 1;
                wds = wd[w];
                _d.label = 3;
            case 3:
                if (!wds) return [3 /*break*/, 5];
                if (typeof wds === 'function') {
                    wds(vstack);
                }
                else {
                    pl.unshift.apply(pl, wds);
                }
                return [4 /*yield*/, ((_b = opt) === null || _b === void 0 ? void 0 : _b.debug) ? [vstack, pl] : null];
            case 4:
                _d.sent();
                w = pl.shift();
                wds = wd[w];
                return [3 /*break*/, 3];
            case 5:
                if (w) {
                    vstack.push(w);
                }
                return [4 /*yield*/, ((_c = opt) === null || _c === void 0 ? void 0 : _c.debug) ? [vstack, pl] : null];
            case 6:
                _d.sent();
                return [3 /*break*/, 2];
            case 7:
                if (!(wordsProcessed >= maxWordsProcessed)) return [3 /*break*/, 9];
                return [4 /*yield*/, [[vstack, pl], "maxWordsProcessed exceeded: this may be an infinite loop "]];
            case 8:
                _d.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, "fin: all words have been processed with stack of [" + vstack + "]"];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}
// // pounce core
// import * as r from 'ramda';
// import { words } from './words';
// import { Dictionary, Word, DS } from './types';
// export const coreWords = words;

export { purr };
