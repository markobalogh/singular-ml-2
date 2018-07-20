import { TemplateMatchingModel } from './templateMatchingModel';
import { Parameter } from './parameter';
import { Instance } from './instance';
import { Normalization } from './normalization';
import { DistanceWeighting } from './distanceWeighting';
import { DistanceMetric } from './distanceMetric';
import { Prediction } from './prediction';
import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
export declare enum ZeroDistanceHandling {
    continue = 0,
    remove = 1,
    return = 2
}
export interface NearestNeighborConfig {
    distanceWeighting?: DistanceWeighting;
    distanceMetric?: DistanceMetric;
    zeroDistanceHandling?: ZeroDistanceHandling;
    featureWeights?: Parameter[];
}
export declare class NearestNeighborsModel extends TemplateMatchingModel {
    templates: Instance[];
    /**
     * **k** in the traditional sense of k-nearest neighbors. Only the `k` nearest instances are allowed to vote when this model is queried. If `NaN` then all instances are given voting rights.
     *
     * Default value: 1
     */
    k: Parameter;
    /**
     * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
     *
     * Default value: 1
     */
    sigma: Parameter;
    /**
     * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
     */
    exponent: Parameter;
    /**
     * Each parameter in this list represents the weight of the corresponding feature during effective distance calculations. The featureWeights are passed to `NearestNeighbors.distanceMetric.evaluate()` when `NearestNeighbors.featureWeighting` == `true`
     */
    featureWeights: Parameter[] | undefined;
    /**
     * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
     */
    distanceWeighting: DistanceWeighting;
    /**
     * If `true`, enables different features to have different weight when the distance between two instances is measured. The weights must be stored in `NearestNeighbors.featureWeights`.
     */
    featureWeighting: boolean;
    /**
     *
     */
    distanceMetric: DistanceMetric;
    zeroDistanceHandling: ZeroDistanceHandling;
    normalizations: (Normalization | undefined)[];
    readonly parameters: Parameter[];
    constructor(templates: Instance[], distanceWeighting: DistanceWeighting | undefined, featureWeighting: boolean | undefined, distanceMetric: DistanceMetric | undefined, zeroDistanceHandling: ZeroDistanceHandling, normalizations?: (Normalization | undefined)[]);
    private measureDistances;
    private vote;
    query(instance: Instance): Prediction;
}
export declare class NearestNeighbors extends LearningAlgorithm {
    /**
     * **k** in the traditional sense of k-nearest neighbors. Only the `k` nearest instances are allowed to vote when this model is queried. If `NaN` then all instances are given voting rights.
     *
     * Default value: 1
     */
    k: Parameter;
    /**
     * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
     *
     * Default value: 1
     */
    sigma: Parameter;
    /**
     * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
     */
    exponent: Parameter;
    /**
     * Each parameter in this list represents the weight of the corresponding feature during effective distance calculations. The featureWeights are passed to `NearestNeighbors.distanceMetric.evaluate()` when `NearestNeighbors.featureWeighting` == `true`
     */
    featureWeights: Parameter[] | undefined;
    /**
     * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
     */
    distanceWeighting: DistanceWeighting;
    /**
     * If `true`, enables different features to have different weight when the distance between two instances is measured. The weights must be stored in `NearestNeighbors.featureWeights`.
     */
    featureWeighting: boolean;
    /**
     *
     */
    distanceMetric: DistanceMetric;
    zeroDistanceHandling: ZeroDistanceHandling;
    readonly parameters: Parameter[];
    constructor(config?: NearestNeighborConfig);
    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value. Choose a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    setReasonableSigmaBounds(templates: Instance[]): number[];
    learnFrom(trainingSet: Instance[]): Model;
}
