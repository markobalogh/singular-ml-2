import { LearningAlgorithm } from './learningAlgorithm';
import { randomSample, mean } from './utilities';
import { sum } from 'lodash';
import { Model } from './model';
import { TestResult } from './scoringFunction';
import { ABT } from './abt';
export type DistanceWeighting = 'generalizedGaussian'|'constant';
export type ZeroDistanceHandling = 'continue'|'remove'|'return';
export type DistanceMetric = 'euclidean';

export class NearestNeighbors extends LearningAlgorithm {
    /**
     * **k** in the traditional sense of k-nearest neighbors. Only the `k` nearest instances are allowed to vote when this model is queried. If undefined then all instances are given voting rights.
     */
    public k?:number;
    /**
     * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
     * 
     * Default value: 1
     */
    public sigma:number = 1;
    /**
     * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
     * 
     * Default value: 2
     */
    public exponent:number = 2;
    /**
     * Each number in this list represents the weight of the corresponding feature during effective distance calculations. 
     * 
     * Default value: undefined (uniform feature weighting)
     */
    public featureWeights?:number[];
    /**
     * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
     */
    public distanceWeighting:DistanceWeighting = 'generalizedGaussian';
    /**
     * Determines how the distance between two instances is calculated.
     */
    public distanceMetric:DistanceMetric = 'euclidean';
    public zeroDistanceHandling:ZeroDistanceHandling = 'continue';

    constructor() {
        super();
    }

    withK(k:number):this {
        this.k = k;
        return this;
    }

    withSigma(sigma:number):this {
        this.sigma = sigma;
        return this;
    }

    withExponent(exponent:number):this {
        this.exponent = exponent;
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

    withFeatureWeights(featureWeights:number[]):this {
        this.featureWeights = featureWeights;
        return this;
    }

    static evaluateDistance(instanceA:number[], instanceB:number[], featureWeights?:number[]):number {
        if (featureWeights) {
            let sum = 0;
            let weightSum = 0;
            for (let i=0;i<instanceA.length;i++) {
                sum += Math.pow((instanceA[i]-instanceB[i]),2)*featureWeights[i];
                weightSum += featureWeights[i];
            }
            return Math.sqrt(sum/weightSum);
        } else {
            let sum = 0;
            for (let i=0;i<instanceA.length;i++) {
                sum += Math.pow((instanceA[i] - instanceB[i]),2);
            }
            return Math.sqrt(sum);
        }
    }

    query(abt:ABT):NearestNeighborsModel {
        return new NearestNeighborsModel(abt.descriptiveInstances, abt.targetInstances, this.k, this.sigma, this.exponent, this.distanceWeighting, this.distanceMetric, this.featureWeights, this.zeroDistanceHandling);
    }
}

//Should we also return a confidence?
export class NearestNeighborsModel extends Model<number[], {prediction:number,confidence:number}[]>{

    constructor(public templates:number[][], public targets:number[][], public k:number|undefined, public sigma:number, public exponent:number, public distanceWeighting:DistanceWeighting, public distanceMetric:DistanceMetric, public featureWeights:number[]|undefined, public zeroDistanceHandling:ZeroDistanceHandling) {
        super();
    }

    private measureDistances(queryInstance:number[]):number[] {
        let returnArray = new Array<number>(this.templates.length);
        for (let i=0;i<this.templates.length;i++) {
            returnArray[i] = NearestNeighbors.evaluateDistance(queryInstance, this.templates[i], this.featureWeights);
        }
        return returnArray;
    }

    private applyDistanceWeighting(distance:number):number {
        switch (this.distanceWeighting) {
            case 'generalizedGaussian':
                return Math.exp(-1 * Math.pow(distance, this.exponent) / Math.pow(this.sigma, this.exponent));
                break;
            case 'constant':
                return 1;
                break;
            default:
                return NaN
                break;
        }
    }

    private vote(distances:number[], queryInstance:number[]):{prediction:number,confidence:number}[] {
        let distancesAndVotes = distances.map((value,index)=>{
            return {distance:distances[index], targets:this.targets[index]}
        }).sort((a,b)=>a.distance - b.distance);
        if (this.k) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k);
        }
        distances = distancesAndVotes.map(value=>value.distance);
        let votes = distancesAndVotes.map(value=>value.targets);
        //check if any neighboring instance is a distance of zero away from the query instance.
        let zeroIndex = distances.findIndex(distance=>distance == 0);
        if (zeroIndex != -1) {
            if (this.zeroDistanceHandling == 'continue') {
                //do nothing
            } else if (this.zeroDistanceHandling == 'return') {
                return votes[zeroIndex].map(value=>{return {prediction:value, confidence:1}});
            } else if (this.zeroDistanceHandling == 'remove') {
                //note how inefficient this is
                votes = votes.filter((value,index)=>distances[index] != 0);
                distances = distances.filter(distance=>distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance=>this.applyDistanceWeighting(distance));
        let returnedPrediction:number[] = [];
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            returnedPrediction = queryInstance;
        } else {
            //if not, return the weighted average of the votes
            returnedPrediction = votes[0].map((value,index)=>mean(votes.map(instance=>instance[index]), weights));
        }
        //return a testResult object for each target feature
        let returnArray:{prediction:number,confidence:number}[] = [];
        for (let i=0;i<returnedPrediction.length;i++) {
            let sum = 0;
            let sumweights = 0;
            //potential optimization: sumweights will be the same for each requested prediction. here we repeat its computation for each requested prediction.
            for (let k=0;k<votes.length;k++) {
                sum += votes[k][i];
                sumweights += weights[k];
            }
            returnArray.push({
                prediction: sum/sumweights,
                confidence: sumweights
            });
        }
        return returnArray;

    }

    query(instance:number[]):{prediction:number,confidence:number}[] {
        return this.vote(this.measureDistances(instance), instance);
    }
}