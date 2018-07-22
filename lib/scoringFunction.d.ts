import { TestResults } from './learningAlgorithm';
/**
 * Scoring functions evaluate individual *tests*, which are collections of instances and associated predictions.
 */
export declare type ScoringFunction = (testResults: TestResults) => number;
/**
 * Cross validation scoring functions evaluate groups of tests.
 */
export declare type CrossValidationScoringFunction = (tests: TestResults[]) => number;
export declare var MAE: ScoringFunction;
export declare var RMSE: ScoringFunction;
export declare var CrossValidatedMAE: CrossValidationScoringFunction;
export declare var CrossValidatedRMSE: CrossValidationScoringFunction;
