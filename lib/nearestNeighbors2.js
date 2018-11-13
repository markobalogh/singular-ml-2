"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const learningAlgorithm_1 = require("./learningAlgorithm");
const utilities_1 = require("./utilities");
const model_1 = require("./model");
class NearestNeighbors extends learningAlgorithm_1.LearningAlgorithm {
    constructor() {
        super();
        /**
         * Sets the standard deviation of the gaussian distribution associated with each instance when using guassian distance weighting.
         *
         * Default value: 1
         */
        this.sigma = 1;
        /**
         * Overrides the exponent in the gaussian distribution's probability density function for use in generalized gaussian distance weighting.
         *
         * Default value: 2
         */
        this.exponent = 2;
        /**
         * Determines the weight given to each instance in NearestNeighbors.templates as a function of their distance from the query instance.
         */
        this.distanceWeighting = 'generalizedGaussian';
        /**
         * Determines how the distance between two instances is calculated.
         */
        this.distanceMetric = 'euclidean';
        this.zeroDistanceHandling = 'continue';
    }
    withK(k) {
        this.k = k;
        return this;
    }
    withSigma(sigma) {
        this.sigma = sigma;
        return this;
    }
    withExponent(exponent) {
        this.exponent = exponent;
        return this;
    }
    withDistanceWeighting(distanceWeighting) {
        this.distanceWeighting = distanceWeighting;
        return this;
    }
    withDistanceMetric(distanceMetric) {
        this.distanceMetric = distanceMetric;
        return this;
    }
    withZeroDistanceHandling(zeroDistanceHandling) {
        this.zeroDistanceHandling = zeroDistanceHandling;
        return this;
    }
    withFeatureWeights(featureWeights) {
        this.featureWeights = featureWeights;
        return this;
    }
    static evaluateDistance(instanceA, instanceB, featureWeights) {
        if (featureWeights) {
            let sum = 0;
            let weightSum = 0;
            for (let i = 0; i < instanceA.length; i++) {
                sum += Math.pow((instanceA[i] - instanceB[i]), 2) * featureWeights[i];
                weightSum += featureWeights[i];
            }
            return Math.sqrt(sum / weightSum);
        }
        else {
            let sum = 0;
            for (let i = 0; i < instanceA.length; i++) {
                sum += Math.pow((instanceA[i] - instanceB[i]), 2);
            }
            return Math.sqrt(sum);
        }
    }
    query(templates) {
        return new NearestNeighborsModel(templates, this.k, this.sigma, this.exponent, this.distanceWeighting, this.distanceMetric, this.featureWeights, this.zeroDistanceHandling);
    }
}
exports.NearestNeighbors = NearestNeighbors;
//Should we also return a confidence?
class NearestNeighborsModel extends model_1.Model {
    constructor(templates, k, sigma, exponent, distanceWeighting, distanceMetric, featureWeights, zeroDistanceHandling) {
        super();
        this.templates = templates;
        this.k = k;
        this.sigma = sigma;
        this.exponent = exponent;
        this.distanceWeighting = distanceWeighting;
        this.distanceMetric = distanceMetric;
        this.featureWeights = featureWeights;
        this.zeroDistanceHandling = zeroDistanceHandling;
    }
    measureDistances(queryInstance) {
        let returnArray = new Array(this.templates.length);
        for (let otherInstance of this.templates) {
            returnArray.push(NearestNeighbors.evaluateDistance(queryInstance, otherInstance, this.featureWeights));
        }
        return returnArray;
    }
    applyDistanceWeighting(distance) {
        switch (this.distanceWeighting) {
            case 'generalizedGaussian':
                return Math.exp(-1 * Math.pow(distance, this.exponent) / Math.pow(this.sigma, this.exponent));
                break;
            case 'constant':
                return 1;
                break;
            default:
                return NaN;
                break;
        }
    }
    vote(distances, queryInstance) {
        let distancesAndVotes = distances.map((value, index) => {
            return { distance: distances[index], template: this.templates[index] };
        }).sort((a, b) => a.distance - b.distance);
        if (this.k) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k);
        }
        distances = distancesAndVotes.map(value => value.distance);
        let votes = distancesAndVotes.map(value => value.template);
        //check if any neighboring instance is a distance of zero away from the query instance.
        let zeroIndex = distances.findIndex(distance => distance == 0);
        if (zeroIndex != -1) {
            if (this.zeroDistanceHandling == 'continue') {
                //do nothing
            }
            else if (this.zeroDistanceHandling == 'return') {
                return votes[zeroIndex];
            }
            else if (this.zeroDistanceHandling == 'remove') {
                //note how inefficient this is
                votes = votes.filter((value, index) => distances[index] != 0);
                distances = distances.filter(distance => distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance => this.applyDistanceWeighting(distance));
        let returnedPrediction = [];
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            returnedPrediction = queryInstance;
        }
        else {
            //if not, return the weighted average of the votes
            returnedPrediction = votes[0].map((value, index) => utilities_1.mean(votes.map(instance => instance[index]), weights));
        }
        return returnedPrediction;
    }
    query(instance) {
        return this.vote(this.measureDistances(instance), instance);
    }
}
exports.NearestNeighborsModel = NearestNeighborsModel;
//# sourceMappingURL=nearestNeighbors2.js.map