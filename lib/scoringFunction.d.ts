import { Prediction } from './prediction';
import { Instance } from './instance';
/**
 * Scoring functions evaluate individual *tests*, which are collections of instances and associated predictions.
 */
export declare type ScoringFunction = (instances: Instance[], predictions: Prediction[]) => number;
/**
 * Objective functions evaluate groups of tests, which you'd get, for example, from leave-one-out cross validation.
 */
export declare type ObjectiveFunction = (testResults: {
    instances: Instance[];
    predictions: Prediction[];
}[]) => number;
export declare var MAE: ScoringFunction;
export declare var RMSE: ScoringFunction;
