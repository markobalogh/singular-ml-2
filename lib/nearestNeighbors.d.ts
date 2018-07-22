import { TemplateMatchingModel } from './templateMatchingModel';
import { Parameter } from './parameter';
import { Instance } from './instance';
import { DistanceMetric } from './distanceMetric';
import { Prediction } from './prediction';
import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
export declare type DistanceWeighting = 'generalizedGaussian' | 'constant';
export declare type ZeroDistanceHandling = 'continue' | 'remove' | 'return';
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
     * Determines how the distance between two instances is calculated.
     */
    distanceMetric: DistanceMetric;
    zeroDistanceHandling: ZeroDistanceHandling;
    readonly parameters: Parameter[];
    constructor();
    withK(k: number): this;
    withSigma(sigma: number): this;
    withExponent(exponent: number): this;
    withDistanceWeighting(distanceWeighting: DistanceWeighting): this;
    withDistanceMetric(distanceMetric: DistanceMetric): this;
    withZeroDistanceHandling(zeroDistanceHandling: ZeroDistanceHandling): this;
    withFeatureWeights(featureWeights: number[] | Parameter[]): this;
    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value, sets sigma equal to the midpoint of that interval and bounds the parameter accordingly. Chooses a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    extractReasonableParameterBoundsFrom(templates: Instance[]): this;
    learnFrom(trainingSet: Instance[]): Model;
}
export declare class NearestNeighborsModel extends TemplateMatchingModel {
    templates: Instance[];
    k: Parameter;
    sigma: Parameter;
    exponent: Parameter;
    distanceWeighting: DistanceWeighting;
    distanceMetric: DistanceMetric;
    featureWeights: Parameter[] | undefined;
    zeroDistanceHandling: ZeroDistanceHandling;
    static from(learningAlgorithm: NearestNeighbors, templates: Instance[]): NearestNeighborsModel;
    readonly parameters: Parameter[];
    constructor(templates: Instance[], k: Parameter, sigma: Parameter, exponent: Parameter, distanceWeighting: DistanceWeighting, distanceMetric: DistanceMetric, featureWeights: Parameter[] | undefined, zeroDistanceHandling: ZeroDistanceHandling);
    private measureDistances;
    private applyDistanceWeighting;
    private vote;
    query(instance: Instance): Prediction;
}
