import { Prediction } from './prediction';
import { Instance } from './instance';
/**
 * Scoring functions evaluate individual *tests*, which are collections of instances and associated predictions.
 */
export declare type ScoringFunction = (testSet: Instance[], predictions: Prediction[]) => number;
/**
 * Cross validation scoring functions evaluate groups of tests.
 */
export declare type CrossValidationScoringFunction = (tests: {
    testSet: Instance[];
    predictions: Prediction[];
}[]) => number;
export declare var MAE: ScoringFunction;
export declare var RMSE: ScoringFunction;
export declare var CrossValidatedMAE: CrossValidationScoringFunction;
export declare var CrossValidatedRMSE: CrossValidationScoringFunction;
