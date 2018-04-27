import { Instance } from './instance';
import { mean } from './utilities';
import { sum } from 'lodash';
export class DistanceMetric {
    constructor() {}
    /**
     * Returns the distance between instanceA and instanceB.
     */
    evaluate(instanceA:Instance, instanceB:Instance, featureWeights?:number[]):number {
        return NaN
    }
}

export var EuclideanDistanceMetric = new DistanceMetric();
euclideanDistanceMetric.evaluate = function(instanceA:Instance, instanceB:Instance, featureWeights?:number[]):number {
    if (featureWeights) {
        return Math.sqrt(mean(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2)), featureWeights));
    } else {
        return Math.sqrt(sum(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2))));
    }
}
