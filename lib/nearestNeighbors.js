"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templateMatchingModel_1 = require("./templateMatchingModel");
const parameter_1 = require("./parameter");
const distanceWeighting_1 = require("./distanceWeighting");
const distanceMetric_1 = require("./distanceMetric");
const utilities_1 = require("./utilities");
const lodash_1 = require("lodash");
const prediction_1 = require("./prediction");
var ZeroDistanceHandling;
(function (ZeroDistanceHandling) {
    ZeroDistanceHandling[ZeroDistanceHandling["continue"] = 0] = "continue";
    ZeroDistanceHandling[ZeroDistanceHandling["remove"] = 1] = "remove";
    ZeroDistanceHandling[ZeroDistanceHandling["return"] = 2] = "return";
})(ZeroDistanceHandling = exports.ZeroDistanceHandling || (exports.ZeroDistanceHandling = {}));
// NOTE: follow the pattern shown for DistanceMetric and EuclideanDistanceMetric for the DistanceWeighting class. This patterns allows the class method to be called correctly. I tested this in test.ts
class NearestNeighbors extends templateMatchingModel_1.TemplateMatchingModel {
    constructor(templates, distanceWeighting = distanceWeighting_1.GeneralizedGaussianDistanceWeighting, featureWeighting = false, distanceMetric = distanceMetric_1.EuclideanDistanceMetric, zeroDistanceHandling, normalizations) {
        super();
        this.templates = templates;
        //handle different parameter initializations based on the behaviors specified in the constructor.
        this.distanceWeighting = distanceWeighting;
        this.featureWeighting = featureWeighting;
        this.distanceMetric = distanceMetric;
        this.zeroDistanceHandling = zeroDistanceHandling;
        if (normalizations) {
            this.normalizations = normalizations;
        }
        else {
            this.normalizations = Array(templates[0].values.length).fill(undefined);
        }
        switch (this.distanceWeighting) {
            case distanceWeighting_1.GeneralizedGaussianDistanceWeighting:
                this.sigma = new parameter_1.Parameter(1, false, ...this.calculateSigmaBounds());
                this.exponent = new parameter_1.Parameter(2, false, 0, 10);
                this.k = new parameter_1.Parameter(NaN, true);
                break;
            case distanceWeighting_1.ConstantDistanceWeighting:
                this.k = new parameter_1.Parameter(1, false, 1, this.templates.length);
                this.sigma = new parameter_1.Parameter(NaN, true);
                this.exponent = new parameter_1.Parameter(NaN, true);
                break;
            default:
                this.k = new parameter_1.Parameter(NaN, true);
                this.sigma = new parameter_1.Parameter(NaN, true);
                this.exponent = new parameter_1.Parameter(NaN, true);
        }
        switch (this.featureWeighting) {
            case true:
                this.featureWeights = this.templates[0].values.map((value) => {
                    return new parameter_1.Parameter(1, false, 0, 10);
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
    get parameters() {
    }
    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value. Choose a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    calculateSigmaBounds() {
        if (this.templates.length > 1000) {
            let instancesToTest = utilities_1.randomSample(this.templates, 50);
        }
        else {
            let instancesToTest = utilities_1.randomSample(this.templates, Math.round(this.templates.length / 10));
        }
        let lowerBound = Infinity;
        let upperBound = 0;
        let distances = [];
        for (let i = 0; i < this.templates.length; i++) {
            for (let k = Number(i); k < this.templates.length; k++) {
                distances.push(this.distanceMetric.evaluate(this.templates[i], this.templates[k]));
            }
        }
        lowerBound = utilities_1.percentile(distances, 0.01);
        upperBound = utilities_1.percentile(distances, 0.99);
        return [lowerBound, upperBound];
    }
    measureDistances(queryInstance) {
        return this.templates.map(otherInstance => {
            return this.distanceMetric.evaluate(queryInstance, otherInstance, this.featureWeights);
        });
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
            if (this.zeroDistanceHandling == ZeroDistanceHandling.continue) {
                //do nothing
            }
            else if (this.zeroDistanceHandling == ZeroDistanceHandling.return) {
                return prediction_1.Prediction.fromInstance(votes[zeroIndex]).setUniformConfidence(Infinity);
            }
            else if (this.zeroDistanceHandling == ZeroDistanceHandling.remove) {
                votes = votes.filter((value, index) => distances[index] != 0);
                distances = distances.filter(distance => distance != 0);
            }
        }
        //weigh the votes by distance
        let weights = distances.map(distance => this.distanceWeighting.apply(distance));
        //check if the closest instance got a weight of zero.
        if (weights[0] == 0) {
            //in that case, we return the instance exactly as we got it, because we can't provide any predictive value.
            return prediction_1.Prediction.fromInstance(queryInstance).setUniformConfidence(0);
        }
        else {
            //if not, return the weighted average of the votes
            return new prediction_1.Prediction(votes[0].values.map((value, index) => utilities_1.mean(votes.map(instance => instance.values[index]))), this.normalizations, votes[0].values.map((value, index) => lodash_1.sum(weights.map(weight => weight[index]))));
        }
    }
    query(instance) {
        return this.vote(this.measureDistances(instance), instance);
    }
}
exports.NearestNeighbors = NearestNeighbors;
//# sourceMappingURL=nearestNeighbors.js.map