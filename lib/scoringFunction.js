"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const learningAlgorithm_1 = require("./learningAlgorithm");
exports.MAE = function (testResults) {
    return utilities_1.mean(testResults.testSet.map((instance, index) => Math.abs(instance.targetValues[0] - testResults.predictions[index].targetValues[0])));
};
exports.RMSE = function (testResults) {
    return Math.sqrt(utilities_1.mean(testResults.testSet.map((instance, index) => Math.pow((instance.targetValues[0] - testResults.predictions[index].targetValues[0]), 2))));
};
exports.CrossValidatedMAE = function (tests) {
    return utilities_1.mean(tests.map(testObj => {
        return exports.MAE(new learningAlgorithm_1.TestResults(testObj.testSet, testObj.predictions));
    }));
};
exports.CrossValidatedRMSE = function (tests) {
    return exports.RMSE(new learningAlgorithm_1.TestResults(Array.prototype.concat(tests.map(testObj => testObj.testSet)), Array.prototype.concat(tests.map(testObj => testObj.predictions))));
};
//NOTE: we should redesign how scoring functions and cross validation scoring functions work - in reality, we have scoring functions that map testResults to numbers and then we have a few different ways to aggregate those numbers when cross validation (i.e., multiple tests) needs to be scored.
//# sourceMappingURL=scoringFunction.js.map