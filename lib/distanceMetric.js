"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const lodash_1 = require("lodash");
class DistanceMetric {
    constructor() { }
    /**
     * Returns the distance between instanceA and instanceB.
     */
    evaluate(instanceA, instanceB, featureWeights) {
        return NaN;
    }
}
exports.DistanceMetric = DistanceMetric;
exports.EuclideanDistanceMetric = new DistanceMetric();
exports.EuclideanDistanceMetric.evaluate = function (instanceA, instanceB, featureWeights) {
    if (featureWeights) {
        return Math.sqrt(utilities_1.mean(instanceA.values.map((value, index) => Math.pow((instanceA.values[index] - instanceB.values[index]), 2)), featureWeights.map(weight => weight.value)));
    }
    else {
        return Math.sqrt(lodash_1.sum(instanceA.values.map((value, index) => Math.pow((instanceA.values[index] - instanceB.values[index]), 2))));
    }
};
//# sourceMappingURL=distanceMetric.js.map