"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const model_1 = require("./model");
class ScoringFunction extends model_1.Model {
}
exports.ScoringFunction = ScoringFunction;
class MAE extends ScoringFunction {
    constructor() {
        super();
    }
    query(input) {
        let returnArray = new Array(input.length);
        for (let i = 0; i < input.length; i++) {
            returnArray[i] = Math.abs(input[i].prediction - input[i].target);
        }
        if (input[0].confidence) {
            try {
                return utilities_1.mean(returnArray, input.map(obj => obj.confidence));
            }
            catch (err) {
                throw new Error('If confidences are set for any predictions, they must be set for all predictions.');
            }
        }
        else {
            return utilities_1.mean(returnArray);
        }
    }
}
exports.MAE = MAE;
class RMSE extends ScoringFunction {
    constructor() {
        super();
    }
    query(input) {
        let returnArray = new Array(input.length);
        for (let i = 0; i < input.length; i++) {
            returnArray[i] = Math.pow((input[i].prediction - input[i].target), 2);
        }
        if (input[0].confidence) {
            try {
                return Math.sqrt(utilities_1.mean(returnArray, input.map(obj => obj.confidence)));
            }
            catch (err) {
                throw new Error('If confidences are set for any predictions, they must be set for all predictions.');
            }
        }
        else {
            return Math.sqrt(utilities_1.mean(returnArray));
        }
    }
}
exports.RMSE = RMSE;
// export var CrossValidatedMAE:CrossValidationScoringFunction = function(tests:{testSet:Instance[],predictions:Prediction[]}[]):number {
//     return mean(tests.map(testObj=>{
//         return MAE(new TestResults(testObj.testSet, testObj.predictions));
//     }));
// }
// export var CrossValidatedRMSE:CrossValidationScoringFunction = function(tests) {
//     return RMSE(new TestResults(Array.prototype.concat(tests.map(testObj=>testObj.testSet)), Array.prototype.concat(tests.map(testObj=>testObj.predictions))));
// }
//NOTE: we should redesign how scoring functions and cross validation scoring functions work - in reality, we have scoring functions that map testResults to numbers and then we have a few different ways to aggregate those numbers when cross validation (i.e., multiple tests) needs to be scored.
//# sourceMappingURL=scoringFunction.js.map