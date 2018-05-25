import { Instance } from './instance';
import { mean } from './utilities';
import { sum } from 'lodash';
import { Parameter } from './parameter';
export class DistanceMetric {
    constructor() {}
    /**
     * Returns the distance between instanceA and instanceB.
     */
    evaluate(instanceA:Instance, instanceB:Instance, featureWeights?:Parameter[]):number {
        return NaN
    }
}

export var EuclideanDistanceMetric = new DistanceMetric();
EuclideanDistanceMetric.evaluate = function(instanceA:Instance, instanceB:Instance, featureWeights?:Parameter[]):number {
    if (featureWeights) {
        return Math.sqrt(mean(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2)), featureWeights.map(weight=>weight.value)));
    } else {
        return Math.sqrt(sum(instanceA.values.map((value, index)=>Math.pow((instanceA.values[index] - instanceB.values[index]), 2))));
    }
}
