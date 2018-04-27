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
// export class EuclideanDistanceMetric extends DistanceMetric {
//     constructor() {
//         super();
//     }
//     static evaluate(instanceA:Instance, instanceB:Instance, featureWeights?:number[]):number {
//         if (featureWeights) {
//             return Math.sqrt(mean(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2)), featureWeights));
//         } else {
//             return Math.sqrt(sum(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2))));
//         }
//     }
// }
exports.euclideanDistanceMetric = new DistanceMetric();
exports.euclideanDistanceMetric.evaluate = function (instanceA, instanceB, featureWeights) {
    if (featureWeights) {
        return Math.sqrt(utilities_1.mean(instanceA.values.map((value, index) => Math.pow((instanceA.values[index] - instanceB.values[index]), 2)), featureWeights));
    }
    else {
        return Math.sqrt(lodash_1.sum(instanceA.values.map((value, index) => Math.pow((instanceA.values[index] - instanceB.values[index]), 2))));
    }
};
// export var euclidean = new _privateClasses.EuclideanDistanceMetric();
// export var newmetric = new DistanceMetric();
//# sourceMappingURL=distanceMetric.js.map