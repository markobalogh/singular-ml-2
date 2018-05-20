import { Instance } from './instance';
export declare class DistanceMetric {
    constructor();
    /**
     * Returns the distance between instanceA and instanceB.
     */
    evaluate(instanceA: Instance, instanceB: Instance, featureWeights?: number[]): number;
}
export declare var EuclideanDistanceMetric: DistanceMetric;
