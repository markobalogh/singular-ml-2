import { ABT } from ".";
import { Model } from './model';
import { Optimizable } from "./optimizer";
import { Parameter } from "./parameter";
export declare abstract class LearningAlgorithm implements Optimizable {
    abstract learnFrom(trainingSet: ABT): Model;
    abstract parameters: Parameter[];
    abstract objective: () => number;
    holdOutCV(dataSet: ABT, testSplit?: number, randomizeTestSet?: boolean, parallel?: boolean): number;
}
