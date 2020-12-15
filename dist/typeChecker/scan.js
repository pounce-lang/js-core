import * as r from 'ramda';
// import { parser } from '../parser/Pinna';
var WordIdType;
(function (WordIdType) {
    WordIdType[WordIdType["STRING"] = 0] = "STRING";
    WordIdType[WordIdType["NUMBER"] = 1] = "NUMBER";
    WordIdType[WordIdType["BOOLEAN"] = 2] = "BOOLEAN";
    WordIdType[WordIdType["LIST"] = 3] = "LIST";
})(WordIdType || (WordIdType = {}));
;
var getWordType = function (w) {
    switch (typeof w) {
        case 'string':
            return WordIdType.STRING;
        case 'number':
            return WordIdType.NUMBER;
        case 'boolean':
            return WordIdType.BOOLEAN;
        default:
            return WordIdType.LIST;
    }
};
var combineSigs = function (inS, outS) {
    var ioSigs = [];
    if (inS.length >= outS.length) {
        inS.forEach(function (inSig, i) {
            var outSig = outS[i];
            if (outSig) {
                ioSigs.push({ in: inSig, out: outSig });
            }
            else {
                ioSigs.push({ in: inSig, out: null });
            }
        });
    }
    else {
        outS.forEach(function (outSig, i) {
            var inSig = inS[i];
            if (inSig) {
                ioSigs.push({ in: inSig, out: outSig });
            }
            else {
                ioSigs.push({ in: null, out: outSig });
            }
        });
    }
    console.log("ioSigs", ioSigs);
    return ioSigs;
};
var getGenericMapping = function (typeStack, ioSigs) {
    var genMappings = {};
    var acc1 = r.reduce(function (acc, sig) {
        var _a, _b;
        var expects = (_a = sig === null || sig === void 0 ? void 0 : sig.in) === null || _a === void 0 ? void 0 : _a.type;
        if (!expects) {
            return acc;
        }
        var genInType = (expects.length === 1) ? expects : "";
        var consume = (((_b = sig.in) === null || _b === void 0 ? void 0 : _b.use) !== "observe");
        var foundType = consume ? acc.pop() : acc[acc.length - 1];
        if (genInType && typeof genInType === 'string') {
            genMappings[genInType] = foundType;
        }
        else {
            console.log("genInType here", genInType);
        }
        return acc;
    }, typeStack, ioSigs);
    console.log("genMappings", genMappings);
    return genMappings;
};
export var typeChecker = function (pl, wd) {
    var typeStack = r.reduce(function (acc, w) {
        var wordInDictionary = typeof w === "string" ? wd[w] : null;
        if (wordInDictionary) {
            console.log(wordInDictionary.sig);
            var inSignature = r.reverse(r.head(wordInDictionary.sig));
            var outSignature = r.reverse(r.head(r.tail(wordInDictionary.sig)));
            var ioSigs = combineSigs(inSignature, outSignature);
            var genMappings_1 = getGenericMapping(acc, ioSigs);
            acc = r.reduce(function (acc, sig) {
                var _a;
                var outType = (_a = sig.out) === null || _a === void 0 ? void 0 : _a.type;
                if (outType && typeof outType === 'string') {
                    if (outType.length === 1) {
                        console.log("push genMappings[outType]", outType, genMappings_1[outType]);
                        acc.push(genMappings_1[outType]);
                    }
                    else {
                        console.log("push outType", outType);
                        acc.push(outType.toUpperCase());
                    }
                }
                else if (outType) { // array of type
                    console.log("outType: ", typeof outType, JSON.stringify(outType));
                }
                return acc;
            }, acc, r.reverse(ioSigs));
        }
        else if (typeof w === 'string') {
            var wt = getWordType(w);
            var wtString = WordIdType[wt];
            acc.push(wtString);
        }
        else if (r.is(Array, w)) {
            var list = typeChecker(w, wd);
            if (typeof list === 'object') {
                acc.push(list);
            }
        }
        return acc;
    }, [], pl);
    console.log(typeStack);
    return typeStack;
};
