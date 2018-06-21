"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
exports.MAE = function (instances, predictions) {
    return utilities_1.mean(instances.map((instance, index) => Math.abs(instance.targetValues[0] - predictions[index].targetValues[0])));
};
exports.RMSE = function (instances, predictions) {
    return Math.sqrt(utilities_1.mean(instances.map((instance, index) => Math.pow((instance.targetValues[0] - predictions[index].targetValues[0]), 2))));
};
exports.CrossValidatedMAE = function (tests) {
    return utilities_1.mean(tests.map(testObj => {
        return exports.MAE(testObj.testSet, testObj.predictions);
    }));
};
exports.CrossValidatedRMSE = function (tests) {
    return exports.RMSE(Array.prototype.concat(tests.map(testObj => testObj.testSet)), Array.prototype.concat(tests.map(testObj => testObj.predictions)));
};
//# sourceMappingURL=scoringFunction.js.map