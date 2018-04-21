"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const distanceWeighting_1 = require("./distanceWeighting");
const distanceMetric_1 = require("./distanceMetric");
//SUPPORTED DISTANCE WEIGHTING MODES HERE //
exports.generalizedGaussian = new distanceWeighting_1.DistanceWeighting();
exports.constant = new distanceWeighting_1.DistanceWeighting();
//SUPPORTED DISTANCE METRICS HERE //
exports.euclidean = new distanceMetric_1.DistanceMetric();
var stanceWeighting;
(function (stanceWeighting) {
    stanceWeighting[stanceWeighting["uniform"] = 0] = "uniform";
})(stanceWeighting = exports.stanceWeighting || (exports.stanceWeighting = {}));
// export class NearestNeighbors extends TemplateMatchingModel {
//     public k:Parameter;
//     public exponent:Parameter;
//     public power:Parameter;
//     public featureWeights:Parameter[];
//     // should I have classes for all these options?? they could have static methods. Or can I import instances of the classes directly?
//     constructor(public templates:Instance[], public distanceWeighting:DistanceWeighting=generalizedGaussian, public featureWeighting:boolean=false, public distanceMetric:DistanceMetric=euclidean, public zeroDistanceHandling:zeroDistanceHandling, public normalization:Normalization, public test:stanceWeighting) {
//         super();
//         //handle different parameter initializations based on the behaviors specified in the constructor.
//         switch (this.distanceWeighting) {
//             case generalizedGaussian:
//                 this.sigma = new Parameter(1, false, 0)
//                 this.exponent = new Parameter(2)
//                 this.power = new Parameter(1)
//         }
//         this.k = new Parameter(undefined)
//         this.featureWeights = [];
//     }
//     /**
//      * Finds a reasonable lower and upper bound for searching for an optimal sigma value. Choose a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
//      */
//     private calculateSigmaBounds():number[] {
//         if (this.templates.length > 1000) {
//             let instancesToTest = randomSample(this.templates, 50)
//         }
//     }
// }
//# sourceMappingURL=nearestNeighbors.js.map