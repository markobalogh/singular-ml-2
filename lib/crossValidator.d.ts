import { LearningAlgorithm } from './learningAlgorithm';
import { ABT } from "./abt";
import { Model } from './model';
import { TestResult } from './scoringFunction';
export declare abstract class CrossValidator<inputType, outputType> extends Model<{
    learningAlgorithm: LearningAlgorithm;
    dataset: ABT;
}, TestResult[]> {
    abstract query(input: {
        learningAlgorithm: LearningAlgorithm;
        dataset: ABT;
    }): TestResult[];
}
export declare class HoldOutCrossValidator extends CrossValidator<number[], {
    prediction: number;
    confidence: number;
}[]> {
    testSplit: number;
    randomize: boolean;
    informationContaminationOffset: number;
    /**
     * `testSplit` is the proportion of the incoming ABT that will be held out as the test set.
     * `randomize` determines whether the test set contains instances randomly sampled from the ABT (default). Otherwise the test set consists of a contiguous slice of the ABT.
     */
    constructor(testSplit?: number, randomize?: boolean, informationContaminationOffset?: number);
    query(input: {
        learningAlgorithm: LearningAlgorithm;
        dataset: ABT;
    }): TestResult[];
}
