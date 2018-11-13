"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameter_1 = require("./parameter");
// import { DistanceWeighting, GeneralizedGaussianDistanceWeighting, ConstantDistanceWeighting } from './distanceWeighting';
const distanceMetric_1 = require("./distanceMetric");
const utilities_1 = require("./utilities");
const lodash_1 = require("lodash");
const prediction_1 = require("./prediction");
const learningAlgorithm_1 = require("./learningAlgorithm");
const model_1 = require("./model");
class NearestNeighbors extends learningAlgorithm_1.LearningAlgorithm {
    get parameters() {
        let params = [];
        for (let property in this) {
            if (this[property] instanceof parameter_1.Parameter) {
                params.push(this[property]);
            }
        }
        return params;
    }
    constructor() {
        super();
        //initialize configuration/parameters to default values in the constructor. If the user wants to modify them they can call a .with[config] method.
        this.distanceWeighting = 'generalizedGaussian';
        this.distanceMetric = distanceMetric_1.EuclideanDistanceMetric;
        this.zeroDistanceHandling = 'remove';
        this.featureWeights = undefined;
        this.k = new parameter_1.Parameter(NaN);
        this.sigma = new parameter_1.Parameter(NaN);
        this.exponent = new parameter_1.Parameter(NaN);
    }
    withK(k) {
        this.k.value = k;
        return this;
    }
    withSigma(sigma) {
        this.sigma.value = sigma;
        return this;
    }
    withExponent(exponent) {
        this.exponent.value = exponent;
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
        if (typeof featureWeights[0] == 'number') {
            this.featureWeights = parameter_1.Parameter.vector(featureWeights, false);
        }
        else {
            this.featureWeights = featureWeights;
        }
        return this;
    }
    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value, sets sigma equal to the midpoint of that interval and bounds the parameter accordingly. Chooses a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    extractReasonableParameterBoundsFrom(templates) {
        let instancesToTest;
        if (templates.length > 1000) {
            instancesToTest = utilities_1.randomSample(templates, 50);
        }
        else {
            instancesToTest = utilities_1.randomSample(templates, Math.round(templates.length / 10));
        }
        let lowerBound = Infinity;
        let upperBound = 0;
        let distances = [];
        for (let i = 0; i < instancesToTest.length; i++) {
            for (let k = Number(i); k < instancesToTest.length; k++) {
                distances.push(this.distanceMetric.evaluate(instancesToTest[i], instancesToTest[k]));
            }
        }
        lowerBound = utilities_1.percentile(distances, 0.01);
        upperBound = utilities_1.percentile(distances, 0.99);
        this.sigma = new parameter_1.Parameter(utilities_1.mean([lowerBound, upperBound]), false, lowerBound, upperBound);
        return this;
    }
    learnFrom(trainingSet) {
        return NearestNeighborsModel.from(this, trainingSet);
    }
}
exports.NearestNeighbors = NearestNeighbors;
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
        //normalize templates
        // this.normalizations = this.templates[0].values.map((obj, index)=>new ZScoreNormalization(this.templates)
    }
    static from(learningAlgorithm, templates) {
        return new NearestNeighborsModel(templates, learningAlgorithm.k, learningAlgorithm.sigma, learningAlgorithm.exponent, learningAlgorithm.distanceWeighting, learningAlgorithm.distanceMetric, learningAlgorithm.featureWeights, learningAlgorithm.zeroDistanceHandling);
    }
    get parameters() {
        let params = [];
        for (let property in this) {
            if (this[property] instanceof parameter_1.Parameter) {
                params.push(this[property]);
            }
        }
        return params;
    }
    measureDistances(queryInstance) {
        return this.templates.map(otherInstance => {
            return this.distanceMetric.evaluate(queryInstance, otherInstance, this.featureWeights);
        });
    }
    applyDistanceWeighting(distance) {
        switch (this.distanceWeighting) {
            case 'generalizedGaussian':
                return Math.exp(-1 * Math.pow(distance, this.exponent.value) / Math.pow(this.sigma.value, this.exponent.value));
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
        if (this.k.value) {
            distancesAndVotes = distancesAndVotes.slice(0, this.k.value);
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
                return prediction_1.Prediction.fromInstance(votes[zeroIndex]).setUniformConfidence(Infinity);
            }
            else if (this.zeroDistanceHandling == 'remove') {
                votes = votes.filter((value, index) => distances[index] != 0);
                distances = distances.filter(distance => distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance => this.applyDistanceWeighting(distance));
        let returnedPrediction;
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            returnedPrediction = prediction_1.Prediction.fromInstance(queryInstance).setUniformConfidence(0);
        }
        else {
            //if not, return the weighted average of the votes
            //the returned prediction is assumed to have the same normalizations as the query instance.
            returnedPrediction = new prediction_1.Prediction(votes[0].values.map((value, index) => utilities_1.mean(votes.map(instance => instance.values[index]), weights)), queryInstance.normalizations, votes[0].values.map((value, index) => lodash_1.sum(weights.map(weight => weights[index]))));
        }
        return returnedPrediction;
    }
    query(instance) {
        return this.vote(this.measureDistances(instance), instance);
    }
}
exports.NearestNeighborsModel = NearestNeighborsModel;
//TODO: change distance weighting to a literal type and build in evaluation of distances into the nearestNeighborsModel class as a private method for each distance weighting. We have to do this because it looks like the only way to provide the k/sigma/exponent parameters to the evaluate method of the distance weighting object.
//# sourceMappingURL=nearestNeighbors.1.js.map