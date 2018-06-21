import { ABT } from ".";
import { Model } from './model';
import { Parameter } from "./parameter";
import { Instance } from "./instance";
import { Prediction } from "./prediction";
export declare abstract class LearningAlgorithm {
    abstract learnFrom(trainingSet: Instance[]): Model;
    abstract parameters: Parameter[];
    holdOutCV(dataset: ABT, testSplit?: number, randomize?: boolean, parallel?: boolean): {
        testSet: Instance[];
        predictions: Prediction[];
    };
}
