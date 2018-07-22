import { ABT } from ".";
import { Model } from './model';
import { Parameter } from "./parameter";
import { Instance } from "./instance";
import { Prediction } from "./prediction";
import { ScoringFunction } from './scoringFunction';
export declare abstract class LearningAlgorithm {
    abstract learnFrom(trainingSet: Instance[]): Model;
    abstract parameters: Parameter[];
    holdOutTest(dataset: ABT, testSplit?: number, randomize?: boolean, parallel?: boolean): TestResults;
}
/**
 * The TestResults class represents the predictions made by a model and the test set those predictions are to be compared to.
 */
export declare class TestResults {
    testSet: Instance[];
    predictions: Prediction[];
    constructor(testSet: Instance[], predictions: Prediction[]);
    scoreWith(scoringFunction: ScoringFunction): number;
}
