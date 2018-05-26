import {TemplateMatchingModel} from './templateMatchingModel';
import {Parameter} from './parameter';
import {Instance} from './instance';
import { Normalization } from './normalization';
import {Feature} from './feature';
import { DistanceWeighting, GeneralizedGaussianDistanceWeighting, ConstantDistanceWeighting } from './distanceWeighting';
import { DistanceMetric, EuclideanDistanceMetric } from './distanceMetric';
import {randomSample, percentile, mean} from './utilities';
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
    public featureWeights:Parameter[]|undefined;
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
    public normalizations:(Normalization|undefined)[];

    constructor(public templates:Instance[], distanceWeighting:DistanceWeighting=GeneralizedGaussianDistanceWeighting, featureWeighting:boolean=false, distanceMetric:DistanceMetric=EuclideanDistanceMetric, zeroDistanceHandling:ZeroDistanceHandling, normalizations?:(Normalization|undefined)[]) {
        super();
        //handle different parameter initializations based on the behaviors specified in the constructor.
        this.distanceWeighting = distanceWeighting;
        this.featureWeighting = featureWeighting;
        this.distanceMetric = distanceMetric;
        this.zeroDistanceHandling = zeroDistanceHandling;
        if (normalizations) {
            this.normalizations = normalizations;
        } else {
            this.normalizations = Array(templates[0].values.length).fill(undefined);
        }
        switch (this.distanceWeighting) {
            case GeneralizedGaussianDistanceWeighting:
                this.sigma = new Parameter(1, false, ...this.calculateSigmaBounds());
                this.exponent = new Parameter(2, false, 0, 10);
                this.k = new Parameter(NaN, true);
                break;
            case ConstantDistanceWeighting:
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
                this.featureWeights = undefined;
        }
        //force all instances to be normalized according to the given normalization.
        if (this.normalizations) {
            for (let instance of this.templates) {
                instance.normalize(this.normalizations);
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

    private measureDistances(queryInstance:Instance):number[] {
        return this.templates.map(otherInstance=>this.distanceMetric.evaluate(queryInstance, otherInstance, this.featureWeights));
    }

    private vote(distances:number[], queryInstance:Instance):Prediction {
        let distancesAndVotes = distances.map((value,index)=>{
            return {distance:distances[index], template:this.templates[index]}
        }).sort((a,b)=>a.distance - b.distance);
        if (this.k.value) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k.value);
        }
        distances = distancesAndVotes.map(value=>value.distance);
        let votes = distancesAndVotes.map(value=>value.template);
        //check if any neighboring instance is a distance of zero away from the query instance.
        let zeroIndex = distances.findIndex(distance=>distance == 0);
        if (zeroIndex != -1) {
            if (this.zeroDistanceHandling == ZeroDistanceHandling.continue) {
                //do nothing
            } else if (this.zeroDistanceHandling == ZeroDistanceHandling.return) {
                return  Prediction.fromInstance(votes[zeroIndex]).setUniformConfidence(Infinity);
            } else if (this.zeroDistanceHandling == ZeroDistanceHandling.remove) {
                votes = votes.filter((value,index)=>distances[index] != 0);
                distances = distances.filter(distance=>distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance=>this.distanceWeighting.apply(distance));
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            return Prediction.fromInstance(queryInstance).setUniformConfidence(0);
        } else {
            //if not, return the weighted average of the votes
            return new Prediction(votes[0].values.map((value,index)=>mean(votes.map(instance=>instance.values[index]))), this.normalizations, votes[0].values.map((value,index)=>sum(weights.map(weight=>weight[index]))))
        }

    }
    
    query(instance:Instance):Prediction {
        return this.vote(this.measureDistances(instance), instance);
    }
}