import { Instance } from './instance';
import { Parameter } from './parameter';
export declare class DistanceMetric {
    constructor();
    /**
     * Returns the distance between instanceA and instanceB.
     */
    evaluate(instanceA: Instance, instanceB: Instance, featureWeights?: Parameter[]): number;
}
export declare var EuclideanDistanceMetric: DistanceMetric;
