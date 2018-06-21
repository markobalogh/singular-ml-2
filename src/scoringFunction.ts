import { Prediction } from './prediction';
import { Instance } from './instance';
import { mean } from './utilities';

/**
 * Scoring functions evaluate individual *tests*, which are collections of instances and associated predictions. 
 */
export type ScoringFunction = (testSet:Instance[], predictions:Prediction[]) => number;

/**
 * Cross validation scoring functions evaluate groups of tests.
 */
export type CrossValidationScoringFunction = (tests:{testSet:Instance[],predictions:Prediction[]}[]) => number;

export var MAE:ScoringFunction = function(instances, predictions) {
    return mean(instances.map((instance, index)=>Math.abs(instance.targetValues[0]-predictions[index].targetValues[0])));
}

export var RMSE:ScoringFunction = function(instances, predictions) {
    return Math.sqrt(mean(instances.map((instance, index)=>Math.pow((instance.targetValues[0]-predictions[index].targetValues[0]), 2))));
}

export var CrossValidatedMAE:CrossValidationScoringFunction = function(tests:{testSet:Instance[],predictions:Prediction[]}[]):number {
    return mean(tests.map(testObj=>{
        return MAE(testObj.testSet, testObj.predictions);
    }));
}

export var CrossValidatedRMSE:CrossValidationScoringFunction = function(tests) {
    return RMSE(Array.prototype.concat(tests.map(testObj=>testObj.testSet)), Array.prototype.concat(tests.map(testObj=>testObj.predictions)));
}