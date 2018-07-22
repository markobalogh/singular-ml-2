import { Prediction } from './prediction';
import { Instance } from './instance';
import { mean } from './utilities';
import { TestResults } from './learningAlgorithm';

/**
 * Scoring functions evaluate individual *tests*, which are collections of instances and associated predictions. 
 */
export type ScoringFunction = (testResults:TestResults) => number;

/**
 * Cross validation scoring functions evaluate groups of tests.
 */
export type CrossValidationScoringFunction = (tests:TestResults[]) => number;

export var MAE:ScoringFunction = function(testResults) {
    return mean(testResults.testSet.map((instance, index)=>Math.abs(instance.targetValues[0]-testResults.predictions[index].targetValues[0])));
}

export var RMSE:ScoringFunction = function(testResults) {
    return Math.sqrt(mean(testResults.testSet.map((instance, index)=>Math.pow((instance.targetValues[0]-testResults.predictions[index].targetValues[0]), 2))));
}

export var CrossValidatedMAE:CrossValidationScoringFunction = function(tests:{testSet:Instance[],predictions:Prediction[]}[]):number {
    return mean(tests.map(testObj=>{
        return MAE(new TestResults(testObj.testSet, testObj.predictions));
    }));
}

export var CrossValidatedRMSE:CrossValidationScoringFunction = function(tests) {
    return RMSE(new TestResults(Array.prototype.concat(tests.map(testObj=>testObj.testSet)), Array.prototype.concat(tests.map(testObj=>testObj.predictions))));
}

//NOTE: we should redesign how scoring functions and cross validation scoring functions work - in reality, we have scoring functions that map testResults to numbers and then we have a few different ways to aggregate those numbers when cross validation (i.e., multiple tests) needs to be scored.