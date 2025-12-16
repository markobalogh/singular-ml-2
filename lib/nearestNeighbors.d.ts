import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
import { ABT } from './abt';
export declare type DistanceWeighting = 'generalizedGaussian' | 'constant' | 'abramsonsPointwiseGaussian';
export declare type ZeroDistanceHandling = 'continue' | 'remove' | 'return';
export declare type DistanceMetric = 'euclidean' | 'mahalanobis';
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
     * Parameter acting that determines the fraction of all templates that are used to contribute to each local sample density estimate in the abramson's pointwise gaussian distance weighting process.
     *
     * The asymptotically ideal number of samples to estimate sample density is n^(4/d+4). Therefore a good initial guess for bandwidth locality is n^(4/d+4) / n.
     *
     * However, higher values are safer. 0.1 will tend to be fine.
     *
     * Default value: 0.1
     */
    bandwidthLocality: number;
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
    bandwidthLocality: number;
    distanceWeighting: DistanceWeighting;
    distanceMetric: DistanceMetric;
    featureWeights: number[] | undefined;
    zeroDistanceHandling: ZeroDistanceHandling;
    private covarianceMatrix;
    private inverseCovarianceMatrix;
    /**
     * Bandwidth factors used to determine the bandwidth used on a per-sample basis when using Abramson's pointwise gaussian distance weighting.
     */
    bandwidthFactors: number[];
    constructor(templates: number[][], targets: number[][], k: number | undefined, sigma: number, exponent: number, bandwidthLocality: number, distanceWeighting: DistanceWeighting, distanceMetric: DistanceMetric, featureWeights: number[] | undefined, zeroDistanceHandling: ZeroDistanceHandling);
    /**
     * Calculates the bandwidth factors used in Abramson's pointwise Gaussian distance weighting.
     *
     * Should be run once before any queries are made. Right now we call it in the class constructor when the class is configured to use Abramson's pointwise Gaussian distance weighting.
     */
    private calculateBandwidthFactors;
    /**
     * Calculate the covariance matrix from all templates
     */
    private calculateCovarianceMatrix;
    /**
     * Invert a matrix using Gaussian elimination with pivoting
     */
    private invertMatrix;
    evaluateDistance(instanceA: number[], instanceB: number[], featureWeights?: number[]): number;
    /**
     * Measures the distances from a query instance to all template instances.
     */
    private measureDistances;
    /**
     * Returns the weight assigned to a sample, as a function of its distance.
     *
     * Also accepts a bandwidth factor used with abramson's pointwise gaussian distance weighting.
     */
    private applyDistanceWeighting;
    /**
     * From a list of distances, computes the result of a distance-weighted vote from the target value corresponding to each template.
     */
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
