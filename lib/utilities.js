"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
var lodash_1 = require("lodash");
exports.mean = lodash_1.mean;
function stdev(values, subtractOneFromDenominator = true) {
    let mean = _.mean(values);
    if (subtractOneFromDenominator) {
        return Math.sqrt(_.sum(values.map((value) => { return Math.pow((value - mean), 2); })) / (values.length - 1));
    }
    else {
        return Math.sqrt(_.sum(values.map((value) => { return Math.pow((value - mean), 2); })) / (values.length));
    }
}
exports.stdev = stdev;
function lastElementOf(array) {
    return array[array.length - 1];
}
exports.lastElementOf = lastElementOf;
function deepCopy(obj) {
    let returnObj = JSON.parse(JSON.stringify(obj));
    return returnObj;
}
exports.deepCopy = deepCopy;
function randomSample(collection, numberOfSamples) {
    return _.sampleSize(collection, numberOfSamples);
}
exports.randomSample = randomSample;
//# sourceMappingURL=utilities.js.map