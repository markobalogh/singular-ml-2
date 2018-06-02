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
/**
 * Instance methods will be copied but static/class methods will not be. Instance properties that are themselves class instances will be copied as objects (their methods will not be copied). Hence to copy those you'll need help from some static `fromObj` method (that's the API typically implemented by this library when necessary).
 */
function flatCopy(obj) {
    let returnObj = Object.assign(Object.create(Object.getPrototypeOf(obj)), JSON.parse(JSON.stringify(obj)));
    return returnObj;
}
exports.flatCopy = flatCopy;
function randomSample(collection, numberOfSamples) {
    return _.sampleSize(collection, numberOfSamples);
}
exports.randomSample = randomSample;
/**
 * Returns a percentile of the given `collection`, where `percentile` is a decimal between 0 and 1. Interpolates between elements of the collection unless `interpolate` is false.
 */
function percentile(collection, percentile, interpolate = true) {
    let sortedCollection = flatCopy(collection.sort((a, b) => { return a - b; }));
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
/**
 * Note: this is not as efficient as a synchronous map when the number of items is large. When the number of items is very small it can be equally efficient.
 */
async function asyncMap(items, map) {
    let promises = items.map(function (value) {
        return new Promise((resolve, reject) => {
            try {
                resolve(map(value));
            }
            catch (error) {
                reject(error);
            }
        });
    });
    return Promise.all(promises);
}
exports.asyncMap = asyncMap;
function logExecutionTime(enabled, workload) {
    if (enabled) {
        let startTime = new Date().getTime();
        workload();
        let endTime = new Date().getTime();
        console.log(`Execution time: ${endTime - startTime} milliseconds.`);
    }
    else {
        workload();
    }
}
exports.logExecutionTime = logExecutionTime;
function unique(array) {
    return _.uniq(array);
}
exports.unique = unique;
function range(length) {
    return _.range(0, length);
}
exports.range = range;
function shuffle(collection) {
    return _.shuffle(collection);
}
exports.shuffle = shuffle;
// /**
//  * Returns a thread-safe random number between zero and 1.
//  */
// export function safeRandom():number {
//     return _.sum(crypto.randomBytes(100))
// }
//# sourceMappingURL=utilities.js.map