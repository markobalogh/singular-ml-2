import { TemplateMatchingModel } from './templateMatchingModel';
import { Parameter } from './parameter';
import {Instance} from './instance';
import { Normalization } from './normalization';
import {Feature} from './feature';
import { DistanceWeighting, GeneralizedGaussianDistanceWeighting, ConstantDistanceWeighting } from './distanceWeighting';
import { DistanceMetric, EuclideanDistanceMetric } from './distanceMetric';
import {randomSample, percentile, mean, filterUndefined} from './utilities';
import {sum} from 'lodash';
import { Prediction } from './prediction';
import { Optimizable, Parametrized } from './optimizer';
import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
import { ABT } from './abt';

export enum ZeroDistanceHandling {
    continue,
    remove,
    return
}

export interface NearestNeighborConfig {
    distanceWeighting?:DistanceWeighting,  
    distanceMetric?:DistanceMetric, 
    zeroDistanceHandling?:ZeroDistanceHandling, 
    featureWeights?:Parameter[]
}

export class NearestNeighbors extends LearningAlgorithm {
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
     * Determines how the distance between two instances is calculated.
     */
    public distanceMetric:DistanceMetric;
    public zeroDistanceHandling:'continue'|'return'|'remove';

    get parameters():Parameter[] {
        let params:any[] = [];
        for (let property in this) {
            if (this[property] instanceof Parameter) {
                params.push(this[property]);
            }
        }
        return params as Parameter[];
    }

    constructor() {
        super();
        //initialize configuration/parameters to default values in the constructor. If the user wants to modify them they can call a .with[config] method.
        this.distanceWeighting = GeneralizedGaussianDistanceWeighting;
        this.distanceMetric = EuclideanDistanceMetric
        this.zeroDistanceHandling = 'remove';
        this.featureWeights = undefined;
        this.k = new Parameter(NaN);
        this.sigma = new Parameter(NaN);
        this.exponent = new Parameter(NaN);
    }

    withDistanceWeighting(distanceWeighting:DistanceWeighting):this {
        this.distanceWeighting = distanceWeighting;
        return this;
    }

    withDistanceMetric(distanceMetric:DistanceMetric):this {
        this.distanceMetric = distanceMetric;
        return this;
    }

    withZeroDistanceHandling(zeroDistanceHandling:'continue'|'return'|'remove'):this {
        this.zeroDistanceHandling = zeroDistanceHandling;
    }

    withFeatureWeights(featureWeights:number[]|Parameter[]):this {
        if (typeof featureWeights[0] == 'number') {
            this.featureWeights = Parameter.vector(<number[]>featureWeights, false);
        } else {
            this.featureWeights = featureWeights as Parameter[];
        }
        return this;
    }

    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value, sets sigma equal to the midpoint of that interval and bounds the parameter accordingly. Chooses a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    extractReasonableParameterBoundsFrom(templates:Instance[]):this {
        let instancesToTest
        if (templates.length > 1000) {
            instancesToTest = randomSample(templates, 50);
        } else {
            instancesToTest = randomSample(templates, Math.round(templates.length / 10));
        }
        let lowerBound = Infinity;
        let upperBound = 0;
        let distances = [];
        for (let i=0; i<instancesToTest.length;i++) {
            for (let k=Number(i); k<instancesToTest.length;k++) {
                distances.push(this.distanceMetric.evaluate(instancesToTest[i], instancesToTest[k]));
            }
        }
        lowerBound = percentile(distances, 0.01);
        upperBound = percentile(distances, 0.99);
        this.sigma = new Parameter(mean([lowerBound, upperBound]), false, lowerBound, upperBound);
        return this;
    }

    learnFrom(trainingSet:Instance[]):Model {
        return new NearestNeighborsModel(trainingSet, this.distanceWeighting, this.featureWeighting, this.distanceMetric, this.zeroDistanceHandling);
    }

}

export class NearestNeighborsModel extends TemplateMatchingModel {
    
    static from(learningAlgorithm:NearestNeighbors, templates:Instance[]):NearestNeighborsModel {
        let model = new NearestNeighborsModel(templates, learningAlgorithm.k, learningAlgorithm.sigma, learningAlgorithm.distanceMetric, learningAlgorithm.featureWeights);
        model.templates = templates;
        model
    }
    

    get parameters():Parameter[] {
        let params:any[] = [];
        for (let property in this) {
            if (this[property] instanceof Parameter) {
                params.push(this[property]);
            }
        }
        return params as Parameter[];
    }

    constructor(public templates:Instance[], public k:Parameter, public sigma:Parameter, public distanceWeighting:DistanceWeighting, public distanceMetric:DistanceMetric, public featureWeights:Parameter[], public zeroDistanceHandling:ZeroDistanceHandling) {
        super();
    }

    private measureDistances(queryInstance:Instance):number[] {
        return this.templates.map(otherInstance=>{
            return this.distanceMetric.evaluate(queryInstance, otherInstance, this.featureWeights)
        });
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

