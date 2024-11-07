import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
import { ABT } from './abt';
export declare type DistanceWeighting = 'generalizedGaussian' | 'constant';
export declare type ZeroDistanceHandling = 'continue' | 'remove' | 'return';
export declare type DistanceMetric = 'euclidean';
export declare class NearestNeighbors extends LearningAlgorithm {
    /**
     * **k** in the traditional sense of k-nearest neighbors. Only the `k` nearest instances are allowed to vote when this model is queried. If undefined then all instances are given voting rights.
     */
    k?: number;
    /**
     * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
     *
     * Default value: 1
     */
    sigma: number;
    /**
     * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
     *
     * Default value: 2
     */
    exponent: number;
    /**
     * Each number in this list represents the weight of the corresponding feature during effective distance calculations.
     *
     * Default value: undefined (uniform feature weighting)
     */
    featureWeights?: number[];
    /**
     * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
     */
    distanceWeighting: DistanceWeighting;
    /**
     * Determines how the distance between two instances is calculated.
     */
    distanceMetric: DistanceMetric;
    zeroDistanceHandling: ZeroDistanceHandling;
    constructor();
    withK(k: number): this;
    withSigma(sigma: number): this;
    withExponent(exponent: number): this;
    withDistanceWeighting(distanceWeighting: DistanceWeighting): this;
    withDistanceMetric(distanceMetric: DistanceMetric): this;
    withZeroDistanceHandling(zeroDistanceHandling: ZeroDistanceHandling): this;
    withFeatureWeights(featureWeights: number[]): this;
    static evaluateDistance(instanceA: number[], instanceB: number[], featureWeights?: number[]): number;
    query(abt: ABT): NearestNeighborsModel;
}
export declare class NearestNeighborsModel extends Model<number[], {
    prediction: number;
    confidence: number;
}[]> {
    templates: number[][];
    targets: number[][];
    k: number | undefined;
    sigma: number;
    exponent: number;
    distanceWeighting: DistanceWeighting;
    distanceMetric: DistanceMetric;
    featureWeights: number[] | undefined;
    zeroDistanceHandling: ZeroDistanceHandling;
    constructor(templates: number[][], targets: number[][], k: number | undefined, sigma: number, exponent: number, distanceWeighting: DistanceWeighting, distanceMetric: DistanceMetric, featureWeights: number[] | undefined, zeroDistanceHandling: ZeroDistanceHandling);
    private measureDistances;
    private applyDistanceWeighting;
    private vote;
    query(instance: number[]): {
        prediction: number;
        confidence: number;
    }[];
    /**
     * Voting subprocesses where the distances, weights, and votes are returned for inspection.
     */
    private voteWithInspection;
    queryWithInspection(instance: number[]): {
        output: {
            prediction: number;
            confidence: number;
        }[];
        distances: number[];
        weights: number[];
        votes: number[][];
    };
}
