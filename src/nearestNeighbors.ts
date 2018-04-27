import {TemplateMatchingModel} from './templateMatchingModel';
import {Parameter} from './parameter';
import {Instance} from './instance';
import { Normalization } from './normalization';
import {Feature} from './feature';
import { DistanceWeighting, GeneralizedGaussianDistanceWeighting, ConstantDistanceWeighting } from './distanceWeighting';
import { DistanceMetric, EuclideanDistanceMetric } from './distanceMetric';
import {randomSample, percentile} from './utilities';
import {sum} from 'lodash';
import { Prediction } from './prediction';

export enum ZeroDistanceHandling {
    continue,
    remove,
    return
}

// NOTE: follow the pattern shown for DistanceMetric and EuclideanDistanceMetric for the DistanceWeighting class. This patterns allows the class method to be called correctly. I tested this in test.ts

export class NearestNeighbors extends TemplateMatchingModel {
    /**
     * **k** in the traditional sense of k-nearest neighbors. Only the `k` nearest instances are allowed to vote when this model is queried. If `NaN` then all instances are given voting rights.
     * 
     * Default value: 1
     */
    public k:Parameter;
    /**
     * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
     * 
     * Default value: 1
     */
    public sigma:Parameter;
    /**
     * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
     */
    public exponent:Parameter;
    /**
     * Each parameter in this list represents the weight of the corresponding feature during effective distance calculations. The featureWeights are passed to `NearestNeighbors.distanceMetric.evaluate()` when `NearestNeighbors.featureWeighting` == `true`
     */
    public featureWeights:Parameter[];
    /**
     * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
     */
    public distanceWeighting:DistanceWeighting;
    /**
     * If `true`, enables different features to have different weight when the distance between two instances is measured. The weights must be stored in `NearestNeighbors.featureWeights`.
     */
    public featureWeighting:boolean;
    /**
     * 
     */
    public distanceMetric:DistanceMetric;
    public zeroDistanceHandling:ZeroDistanceHandling;
    public normalization:Normalization|undefined;

    constructor(public templates:Instance[], distanceWeighting:DistanceWeighting=GeneralizedGaussianDistanceWeighting, featureWeighting:boolean=false, distanceMetric:DistanceMetric=euclideanDistanceMetric, zeroDistanceHandling:ZeroDistanceHandling, normalization?:Normalization) {
        super();
        //handle different parameter initializations based on the behaviors specified in the constructor.
        this.distanceWeighting = distanceWeighting;
        this.featureWeighting = featureWeighting;
        this.distanceMetric = distanceMetric;
        this.zeroDistanceHandling = zeroDistanceHandling;
        this.normalization = normalization;
        switch (this.distanceWeighting) {
            case GeneralizedGaussianDistanceWeighting:
                this.sigma = new Parameter(1, false, ...this.calculateSigmaBounds());
                this.exponent = new Parameter(2, false, 0, 10);
                this.k = new Parameter(NaN, true);
                break;
            case constant:
                this.k = new Parameter(1, false, 1, this.templates.length);
                this.sigma = new Parameter(NaN, true);
                this.exponent = new Parameter(NaN, true);
                break;
            default:
                this.k = new Parameter(NaN, true);
                this.sigma = new Parameter(NaN, true);
                this.exponent = new Parameter(NaN, true);
        }
        switch (this.featureWeighting) {
            case true:
                this.featureWeights = this.templates[0].values.map((value)=>{
                    return new Parameter(1, false, 0, 10);
                });
                break;
            default:
                this.featureWeights = [];
        }
        //force all instances to be normalized according to the given normalization.
        if (this.normalization) {
            for (let instance of this.templates) {
                instance.normalize(this.normalization);
            }
        }
    }

    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value. Choose a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    private calculateSigmaBounds():number[] {
        if (this.templates.length > 1000) {
            let instancesToTest = randomSample(this.templates, 50);
        } else {
            let instancesToTest = randomSample(this.templates, Math.round(this.templates.length / 10));
        }
        let lowerBound = Infinity;
        let upperBound = 0;
        let distances = [];
        for (let i=0; i<this.templates.length;i++) {
            for (let k=Number(i); k<this.templates.length;k++) {
                distances.push(this.distanceMetric.evaluate(this.templates[i], this.templates[k]));
            }
        }
        lowerBound = percentile(distances, 0.01);
        upperBound = percentile(distances, 0.99);
        return [lowerBound, upperBound];
    }

    private measureDistances(instance:Instance):number[] {
        return this.templates.map(otherInstance => this.distanceMetric.evaluate(instance, otherInstance));
    }

    private vote(distances:number[]):Prediction

    public query(instance?:Instance):Prediction {
        return this.vote(this.)
    }
}