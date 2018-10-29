import { TemplateMatchingModel } from './templateMatchingModel';
import { Parameter } from './parameter';
import {Instance} from './instance';
import { Normalization, ZScoreNormalization } from './normalization';
import {Feature} from './feature';
// import { DistanceWeighting, GeneralizedGaussianDistanceWeighting, ConstantDistanceWeighting } from './distanceWeighting';
import { DistanceMetric, EuclideanDistanceMetric } from './distanceMetric';
import {randomSample, percentile, mean, filterUndefined} from './utilities';
import {sum} from 'lodash';
import { Prediction } from './prediction';
import { Optimizable, Parametrized } from './optimizer';
import { LearningAlgorithm } from './learningAlgorithm';
import { Model } from './model';
import { ABT } from './abt';

export type DistanceWeighting = 'generalizedGaussian'|'constant';
export type ZeroDistanceHandling = 'continue'|'remove'|'return';

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
    public distanceWeighting:DistanceWeighting
    /**
     * Determines how the distance between two instances is calculated.
     */
    public distanceMetric:DistanceMetric;
    public zeroDistanceHandling:ZeroDistanceHandling;

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
        this.distanceWeighting = 'generalizedGaussian';
        this.distanceMetric = EuclideanDistanceMetric
        this.zeroDistanceHandling = 'remove';
        this.featureWeights = undefined;
        this.k = new Parameter(NaN);
        this.sigma = new Parameter(NaN);
        this.exponent = new Parameter(NaN);
    }

    withK(k:number):this {
        this.k.value = k;
        return this;
    }

    withSigma(sigma:number):this {
        this.sigma.value = sigma;
        return this;
    }

    withExponent(exponent:number):this {
        this.exponent.value = exponent;
        return this;
    }

    withDistanceWeighting(distanceWeighting:DistanceWeighting):this {
        this.distanceWeighting = distanceWeighting;
        return this;
    }

    withDistanceMetric(distanceMetric:DistanceMetric):this {
        this.distanceMetric = distanceMetric;
        return this;
    }

    withZeroDistanceHandling(zeroDistanceHandling:ZeroDistanceHandling):this {
        this.zeroDistanceHandling = zeroDistanceHandling;
        return this;
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
        return NearestNeighborsModel.from(this, trainingSet);
    }

}

export class NearestNeighborsModel extends TemplateMatchingModel {

    static from(learningAlgorithm:NearestNeighbors, templates:Instance[]):NearestNeighborsModel {
        return new NearestNeighborsModel(templates, learningAlgorithm.k, learningAlgorithm.sigma, learningAlgorithm.exponent, learningAlgorithm.distanceWeighting, learningAlgorithm.distanceMetric, learningAlgorithm.featureWeights, learningAlgorithm.zeroDistanceHandling);
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

    constructor(public templates:Instance[], public k:Parameter, public sigma:Parameter, public exponent:Parameter, public distanceWeighting:DistanceWeighting, public distanceMetric:DistanceMetric, public featureWeights:Parameter[]|undefined, public zeroDistanceHandling:ZeroDistanceHandling) {
        super();
        //normalize templates
        // this.normalizations = this.templates[0].values.map((obj, index)=>new ZScoreNormalization(this.templates)
    }

    private measureDistances(queryInstance:Instance):number[] {
        return this.templates.map(otherInstance=>{
            return this.distanceMetric.evaluate(queryInstance, otherInstance, this.featureWeights)
        });
    }

    private applyDistanceWeighting(distance:number):number {
        switch (this.distanceWeighting) {
            case 'generalizedGaussian':
                return Math.exp(-1 * Math.pow(distance, this.exponent.value) / Math.pow(this.sigma.value, this.exponent.value));
                break;
            case 'constant':
                return 1;
                break;
            default:
                return NaN
                break;
        }
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
            if (this.zeroDistanceHandling == 'continue') {
                //do nothing
            } else if (this.zeroDistanceHandling == 'return') {
                return  Prediction.fromInstance(votes[zeroIndex]).setUniformConfidence(Infinity);
            } else if (this.zeroDistanceHandling == 'remove') {
                votes = votes.filter((value,index)=>distances[index] != 0);
                distances = distances.filter(distance=>distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance=>this.applyDistanceWeighting(distance));
        let returnedPrediction:Prediction;
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            returnedPrediction = Prediction.fromInstance(queryInstance).setUniformConfidence(0);
        } else {
            //if not, return the weighted average of the votes
            //the returned prediction is assumed to have the same normalizations as the query instance.
            returnedPrediction = new Prediction(votes[0].values.map((value,index)=>mean(votes.map(instance=>instance.values[index]), weights)), queryInstance.normalizations, votes[0].values.map((value,index)=>sum(weights.map(weight=>weights[index]))))
        }
        return returnedPrediction

    }

    query(instance:Instance):Prediction {
        return this.vote(this.measureDistances(instance), instance);
    }
}

//TODO: change distance weighting to a literal type and build in evaluation of distances into the nearestNeighborsModel class as a private method for each distance weighting. We have to do this because it looks like the only way to provide the k/sigma/exponent parameters to the evaluate method of the distance weighting object.