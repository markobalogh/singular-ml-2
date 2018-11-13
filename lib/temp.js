"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abt_1 = require("./abt");
const nearestNeighbors_1 = require("./nearestNeighbors");
const distanceMetric_1 = require("./distanceMetric");
const crossValidator_1 = require("./crossValidator");
let dataset = new abt_1.ABT().fromFile('data/derived/stfReturn/daily/finalABT.csv');
let algo = new nearestNeighbors_1.NearestNeighbors().withDistanceMetric(distanceMetric_1.EuclideanDistanceMetric).withDistanceWeighting('generalizedGaussian').withZeroDistanceHandling('continue').withExponent(2).withSigma(0.01);
let model = new crossValidator_1.LeaveOneOutCrossValidator().query([algo, dataset]);
//# sourceMappingURL=temp.js.map