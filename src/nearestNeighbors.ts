import { LearningAlgorithm } from './learningAlgorithm';
import { randomSample, mean } from './utilities';
import { sum } from 'lodash';
import { Model } from './model';
import { TestResult } from './scoringFunction';
import { ABT } from './abt';
export type DistanceWeighting = 'generalizedGaussian'|'constant'|'abramsonsPointwiseGaussian';
export type ZeroDistanceHandling = 'continue'|'remove'|'return';
export type DistanceMetric = 'euclidean' | 'mahalanobis';

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
    public exponent: number = 2;
    /**
     * Parameter acting as the proportionality factor between the sigma and the bandwidth used in Abramson's pointwise gaussian distance weighting. 
     * 
     * Default value: 0.5 
     */
    public bandwidthLocality: number = 0.5;
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

    query(abt:ABT):NearestNeighborsModel {
        return new NearestNeighborsModel(abt.descriptiveInstances, abt.targetInstances, this.k, this.sigma, this.exponent, this.distanceWeighting, this.distanceMetric, this.featureWeights, this.zeroDistanceHandling);
    }
}

export class NearestNeighborsModel extends Model<number[], {prediction:number,confidence:number}[]>{

    private covarianceMatrix: number[][] | null = null;
    private inverseCovarianceMatrix: number[][] | null = null;

    /**
     * Bandwidth factors used to determine the bandwidth used on a per-sample basis when using Abramson's pointwise gaussian distance weighting.
     */
    private bandwidthFactors: number[] = [];

    constructor(public templates:number[][], public targets:number[][], public k:number|undefined, public sigma:number, public exponent:number, public bandwidthLocality:number, public distanceWeighting:DistanceWeighting, public distanceMetric:DistanceMetric, public featureWeights:number[]|undefined, public zeroDistanceHandling:ZeroDistanceHandling) {
        super();

        // Calculate the covariance matrix if using Mahalanobis distance
        if (this.distanceMetric === 'mahalanobis') {
            console.log(`${new Date().toLocaleString()}: Calculating covariance matrix for Mahalanobis distance metric...`);
            this.calculateCovarianceMatrix();
            console.log(`${new Date().toLocaleString()}: ...done.`);
        }

        // if using abramson's pointwise gaussian, we need to calculate the bandwidth factors for each sample.
        if (this.distanceWeighting == 'abramsonsPointwiseGaussian') {
            console.log(`${new Date().toLocaleString()}: Calculating bandwidth factors for Abramson's pointwise Gaussian distance weighting...`);
            this.calculateBandwidthFactors();
            console.log(`${new Date().toLocaleString()}: ...done.`);
        } else {
            //fill with dummy data otherwise.
            this.bandwidthFactors = new Array<number>(this.templates.length).fill(1);
        }
    }

    /**
     * Calculates the bandwidth factors used in Abramson's pointwise Gaussian distance weighting.
     * 
     * Should be run once before any queries are made. Right now we call it in the class constructor when the class is configured to use Abramson's pointwise Gaussian distance weighting.
     */
    private calculateBandwidthFactors() {
        //preallocate an array to hold the bandwidth factors
        this.bandwidthFactors = new Array<number>(this.templates.length);
        //iterate through the samples
        for (let i = 0; i < this.templates.length; i++) {
            //measure distances from this sample to all others.
            let distances = this.measureDistances(this.templates[i]).sort((a, b) => a - b); //distances in ascending order
            //heuristic: the ideal number of samples to estimate sample density is sqrt(n)
            distances = distances.slice(1, Math.ceil(Math.sqrt(this.templates.length)+1)); //+1 because the first distance will be zero (distance to itself)
            //use the average distance among these samples as the bandwidth factor for this sample
            this.bandwidthFactors[i] = mean(distances);
        }
    }

    /**
     * Calculate the covariance matrix from all templates
     */
    private calculateCovarianceMatrix(): void {
        const numFeatures = this.templates[0].length;
        const numSamples = this.templates.length;
        
        // Calculate means for each feature
        const means = new Array(numFeatures).fill(0);
        for (let i = 0; i < numSamples; i++) {
            for (let j = 0; j < numFeatures; j++) {
                means[j] += this.templates[i][j];
            }
        }
        for (let j = 0; j < numFeatures; j++) {
            means[j] /= numSamples;
        }
        
        // Calculate covariance matrix
        this.covarianceMatrix = Array(numFeatures).fill(0).map(() => Array(numFeatures).fill(0));
        
        for (let i = 0; i < numFeatures; i++) {
            for (let j = 0; j < numFeatures; j++) {
                let sum = 0;
                for (let k = 0; k < numSamples; k++) {
                    sum += (this.templates[k][i] - means[i]) * (this.templates[k][j] - means[j]);
                }
                this.covarianceMatrix[i][j] = sum / (numSamples - 1);
            }
        }
        
        // Calculate inverse covariance matrix
        try {
            this.inverseCovarianceMatrix = this.invertMatrix(this.covarianceMatrix);
        } catch (error) {
            console.error("Error inverting covariance matrix:", error);
            this.inverseCovarianceMatrix = null;
        }
    }
    
    /**
     * Invert a matrix using Gaussian elimination with pivoting
     */
    private invertMatrix(matrix: number[][]): number[][] {
        const n = matrix.length;
        const identityMatrix = Array(n).fill(0).map((_, i) => 
            Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        );
        
        // Create a copy of the matrix with small regularization on diagonal
        const augmentedMatrix = matrix.map((row, i) => {
            const newRow = [...row];
            // Add small regularization term to diagonal for numerical stability
            newRow[i] += 1e-10;
            return [...newRow, ...identityMatrix[i]];
        });
        
        // Gaussian elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            let maxVal = Math.abs(augmentedMatrix[i][i]);
            
            for (let j = i + 1; j < n; j++) {
                const absVal = Math.abs(augmentedMatrix[j][i]);
                if (absVal > maxVal) {
                    maxVal = absVal;
                    maxRow = j;
                }
            }
            
            // Swap rows if needed
            if (maxRow !== i) {
                [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
            }
            
            // Scale the pivot row
            const pivot = augmentedMatrix[i][i];
            if (Math.abs(pivot) < 1e-10) {
                throw new Error("Matrix is singular or nearly singular");
            }
            
            for (let j = i; j < 2 * n; j++) {
                augmentedMatrix[i][j] /= pivot;
            }
            
            // Eliminate other rows
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = augmentedMatrix[j][i];
                    for (let k = i; k < 2 * n; k++) {
                        augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
                    }
                }
            }
        }
        
        // Extract the inverse matrix
        return augmentedMatrix.map(row => row.slice(n));
    }

    evaluateDistance(instanceA: number[], instanceB: number[], featureWeights?: number[]): number {
        if (this.distanceMetric === 'euclidean') {
            if (featureWeights) {
                let sum = 0;
                let weightSum = 0;
                for (let i = 0; i < instanceA.length; i++) {
                    sum += Math.pow((instanceA[i] - instanceB[i]), 2) * featureWeights[i];
                    weightSum += featureWeights[i];
                }
                return Math.sqrt(sum / weightSum);
            } else {
                let sum = 0;
                for (let i = 0; i < instanceA.length; i++) {
                    sum += Math.pow((instanceA[i] - instanceB[i]), 2);
                }
                return Math.sqrt(sum);
            }
        } else if (this.distanceMetric === 'mahalanobis') {
            // Calculate difference vector
            const diff = instanceA.map((val, i) => val - instanceB[i]);
            
            if (this.inverseCovarianceMatrix && featureWeights) {
                // COMBINED APPROACH - uses both weights AND correlations
                let sum = 0;
                for (let i = 0; i < diff.length; i++) {
                    for (let j = 0; j < diff.length; j++) {
                        // Scale correlation by sqrt of weights
                        const scaledInvCov = this.inverseCovarianceMatrix[i][j] * 
                                            Math.sqrt(featureWeights[i]) * 
                                            Math.sqrt(featureWeights[j]);
                        sum += diff[i] * scaledInvCov * diff[j];
                    }
                }
                return Math.sqrt(sum);
            } else if (this.inverseCovarianceMatrix) {
                // Full Mahalanobis distance calculation using inverse covariance matrix
                let sum = 0;
                for (let i = 0; i < diff.length; i++) {
                    for (let j = 0; j < diff.length; j++) {
                        sum += diff[i] * this.inverseCovarianceMatrix[i][j] * diff[j];
                    }
                }
                return Math.sqrt(sum);
            } else {
                // Fallback to Euclidean if inverse covariance isn't available
                if (featureWeights) {
                    let sum = 0;
                    for (let i = 0; i < diff.length; i++) {
                        sum += diff[i] * diff[i] * featureWeights[i];
                    }
                    return Math.sqrt(sum);
                } else {
                    let sum = 0;
                    for (let i = 0; i < diff.length; i++) {
                        sum += diff[i] * diff[i];
                    }
                    return Math.sqrt(sum);
                }
            }
        } else {
            throw new Error(`Unknown distance metric: ${this.distanceMetric}`);
        }
    }


    /**
     * Measures the distances from a query instance to all template instances.
     */
    private measureDistances(queryInstance:number[]):number[] {
        let returnArray = new Array<number>(this.templates.length-1);
        for (let i = 0; i < this.templates.length; i++) {
            returnArray[i] = this.evaluateDistance(queryInstance, this.templates[i], this.featureWeights);
        }
        return returnArray;
    }

    /**
     * Returns the weight assigned to a sample, as a function of its distance. 
     * 
     * Also accepts a bandwidth factor used with abramson's pointwise gaussian distance weighting.
     */
    private applyDistanceWeighting(distance:number, bandwidthFactor:number):number {
        switch (this.distanceWeighting) {
            case 'generalizedGaussian':
                return Math.exp(-1 * Math.pow(distance, this.exponent) / Math.pow(this.sigma, this.exponent));
                break;
            case 'abramsonsPointwiseGaussian':
                //pointwise gaussian weighting; different weight factor for each sample based on local density.
                //to return the weight of this sample, need to know the bandwidth assigned to this sample
                return Math.exp(-1 * Math.pow(distance, this.exponent) / Math.pow((this.sigma * this.bandwidthLocality * Math.sqrt(bandwidthFactor)), this.exponent));
                break;
            case 'constant':
                return 1;
                break;
            default:
                return NaN
                break;
        }
    }

    /**
     * From a list of distances, computes the result of a distance-weighted vote from the target value corresponding to each template. 
     */
    private vote(distances:number[]):{prediction:number,confidence:number}[] {
        let distancesAndVotes = distances.map((value,index)=>{
            return {distance:distances[index], targets:this.targets[index], bandwidthFactor: this.bandwidthFactors[index]}
        }).sort((a,b)=>a.distance - b.distance);
        if (this.k) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k);
        }
        if (this.zeroDistanceHandling !== 'continue') {
            //check if any neighboring instance is a distance of zero away from the query instance.
            let zeroIndex = distances.findIndex(distance=>distance == 0);
            if (this.zeroDistanceHandling == 'return') {
                return distancesAndVotes[zeroIndex].targets.map(value=>{return {prediction:value, confidence:1}});
            } else if (this.zeroDistanceHandling == 'remove') {
                //note how inefficient this is
                distancesAndVotes = distancesAndVotes.filter((value,index)=>distances[index] != 0);
            }
        }
        //weigh the votes by distance
        let weights = distancesAndVotes.map(value=>this.applyDistanceWeighting(value.distance, value.bandwidthFactor));
        //return a prediction for each target feature. Confidence will be provided by the total weight contributing to the estimate.
        let returnArray: { prediction: number, confidence: number }[] = new Array(distancesAndVotes[0].targets.length);
        //if not, return the weighted average of the votes
        for (let i=0;i<distancesAndVotes[0].targets.length;i++) {
            let sum = 0;
            let sumweights = 0;
            //potential optimization: sumweights will be the same for each requested prediction. here we repeat its computation for each requested prediction.
            for (let k=0;k<distancesAndVotes.length;k++) {
                sum += distancesAndVotes[k].targets[i] * weights[k];
                sumweights += weights[k];
            }
            returnArray[i] = {
                prediction: sum / sumweights,
                confidence: sumweights
            };
        }
        return returnArray;
    }

    query(instance:number[]):{prediction:number,confidence:number}[] {
        return this.vote(this.measureDistances(instance));
    }

    /**
     * Voting subprocesses where the distances, weights, and votes are returned for inspection.
     */
    private voteWithInspection(distances: number[], queryInstance: number[]):
        {
            output: { prediction: number, confidence: number }[],
            distances: number[],
            weights: number[],
            votes: number[][]
        }
    {
        let distancesAndVotes = distances.map((value,index)=>{
            return {distance:distances[index], targets:this.targets[index], bandwidthFactor: this.bandwidthFactors[index]}
        }).sort((a,b)=>a.distance - b.distance);
        if (this.k) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k);
        }
        if (this.zeroDistanceHandling !== 'continue') {
            //check if any neighboring instance is a distance of zero away from the query instance.
            let zeroIndex = distances.findIndex(distance=>distance == 0);
            if (this.zeroDistanceHandling == 'return') {
                return {
                    output: distancesAndVotes[zeroIndex].targets.map(value => { return { prediction: value, confidence: 1 } }),
                    distances: [0],
                    weights: [1],
                    votes: [distancesAndVotes[zeroIndex].targets]
                }
            } else if (this.zeroDistanceHandling == 'remove') {
                //note how inefficient this is
                distancesAndVotes = distancesAndVotes.filter((value,index)=>distances[index] != 0);
            }
        }
        //weigh the votes by distance
        let weights = distancesAndVotes.map(value=>this.applyDistanceWeighting(value.distance, value.bandwidthFactor));
        //return a prediction for each target feature. Confidence will be provided by the total weight contributing to the estimate.
        let returnArray: { prediction: number, confidence: number }[] = new Array(distancesAndVotes[0].targets.length);
        //if not, return the weighted average of the votes
        for (let i=0;i<distancesAndVotes[0].targets.length;i++) {
            let sum = 0;
            let sumweights = 0;
            //potential optimization: sumweights will be the same for each requested prediction. here we repeat its computation for each requested prediction.
            for (let k=0;k<distancesAndVotes.length;k++) {
                sum += distancesAndVotes[k].targets[i] * weights[k];
                sumweights += weights[k];
            }
            returnArray[i] = {
                prediction: sum / sumweights,
                confidence: sumweights
            };
        }
        return {
            output: returnArray,
            distances: distances,
            weights: weights,
            votes: distancesAndVotes.map(vote=>vote.targets)
        }
    }

    queryWithInspection(instance: number[]): {
        output: { prediction: number; confidence: number }[];
        distances: number[];
        weights: number[];
        votes: number[][];
    } {
        return this.voteWithInspection(this.measureDistances(instance), instance);
    }
}