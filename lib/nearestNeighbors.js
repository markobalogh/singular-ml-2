"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templateMatchingModel_1 = require("./templateMatchingModel");
const parameter_1 = require("./parameter");
const distanceWeighting_1 = require("./distanceWeighting");
const distanceMetric_1 = require("./distanceMetric");
const utilities_1 = require("./utilities");
var ZeroDistanceHandling;
(function (ZeroDistanceHandling) {
    ZeroDistanceHandling[ZeroDistanceHandling["continue"] = 0] = "continue";
    ZeroDistanceHandling[ZeroDistanceHandling["remove"] = 1] = "remove";
    ZeroDistanceHandling[ZeroDistanceHandling["return"] = 2] = "return";
})(ZeroDistanceHandling = exports.ZeroDistanceHandling || (exports.ZeroDistanceHandling = {}));
class NearestNeighbors extends templateMatchingModel_1.TemplateMatchingModel {
    constructor(templates, distanceWeighting = distanceWeighting_1.GeneralizedGaussianDistanceWeighting, featureWeighting = false, distanceMetric = distanceMetric_1.DistanceMetric., zeroDistanceHandling, normalization) {
        super();
        this.templates = templates;
        //handle different parameter initializations based on the behaviors specified in the constructor.
        this.distanceWeighting = distanceWeighting;
        this.featureWeighting = featureWeighting;
        this.distanceMetric = distanceMetric;
        this.zeroDistanceHandling = zeroDistanceHandling;
        this.normalization = normalization;
        switch (this.distanceWeighting) {
            case distanceWeighting_1.GeneralizedGaussianDistanceWeighting:
                this.sigma = new parameter_1.Parameter(1, false, ...this.calculateSigmaBounds());
                this.exponent = new parameter_1.Parameter(2, false, 0, 10);
                this.k = new parameter_1.Parameter(NaN, true);
                break;
            case constant:
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
    measureDistances(instance) {
        return this.templates.map(otherInstance => this.distanceMetric.evaluate(instance, otherInstance));
    }
    query(instance) {
        return this.vote(this.);
    }
}
exports.NearestNeighbors = NearestNeighbors;
//# sourceMappingURL=nearestNeighbors.js.map