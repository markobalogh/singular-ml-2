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
/**
 * Returns a percentile of the given `collection`, where `percentile` is a decimal between 0 and 1. Interpolates between elements of the collection unless `interpolate` is false.
 */
function percentile(collection, percentile, interpolate = true) {
    let sortedCollection = deepCopy(collection.sort((a, b) => { return a - b; }));
    if (interpolate) {
        let lowerIndex = Math.floor(sortedCollection.length * percentile);
        let upperIndex = Math.ceil(sortedCollection.length * percentile);
        if (lowerIndex >= (sortedCollection.length - 1)) {
            return sortedCollection[sortedCollection.length - 1];
        }
        else {
            if (upperIndex != lowerIndex) {
                return sortedCollection[lowerIndex] + ((sortedCollection[upperIndex] - sortedCollection[lowerIndex]) * (percentile - (lowerIndex / sortedCollection.length)));
            }
            else {
                return sortedCollection[lowerIndex];
            }
        }
    }
    else {
        return sortedCollection[Math.round(sortedCollection.length * percentile)];
    }
}
exports.percentile = percentile;
function mean(collection, weights) {
    if (weights) {
        return _.sum(collection.map((value, index) => weights[index] * value)) / _.sum(weights);
    }
    else {
        return _.mean(collection);
    }
}
exports.mean = mean;
//# sourceMappingURL=utilities.js.map