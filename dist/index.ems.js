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
function purr(programList, wd) {
    var pl, vstack, w, maxWordsProcessed, wordsProcessed, wds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pl = programList || [];
                vstack = [];
                maxWordsProcessed = 100;
                wordsProcessed = 0;
                _a.label = 1;
            case 1:
                if (!(wordsProcessed < maxWordsProcessed && (w = pl.shift()))) return [3 /*break*/, 8];
                wordsProcessed += 1;
                wds = wd[w];
                _a.label = 2;
            case 2:
                if (!wds) return [3 /*break*/, 6];
                if (!(typeof wds === 'function')) return [3 /*break*/, 4];
                wds(vstack);
                return [4 /*yield*/, vstack];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                pl.unshift.apply(pl, wds);
                _a.label = 5;
            case 5:
                w = pl.shift();
                wds = wd[w];
                return [3 /*break*/, 2];
            case 6:
                if (w) {
                    vstack.push(w);
                }
                return [4 /*yield*/, vstack];
            case 7:
                _a.sent();
                return [3 /*break*/, 1];
            case 8:
                if (!(wordsProcessed >= maxWordsProcessed)) return [3 /*break*/, 10];
                return [4 /*yield*/, "maxWordsProcessed exceeded: this may be a "];
            case 9:
                _a.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, "fin: all words have been processed with stack of [" + vstack + "]"];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}
// // pounce core
// import * as r from 'ramda';
// import { words } from './words';
// import { Dictionary, Word, DS } from './types';
// export const coreWords = words;

export { purr };
