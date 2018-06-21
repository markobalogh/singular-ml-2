import { ABT } from ".";
import { Model } from './model';
import { Optimizable } from "./optimizer";
import { Parameter } from "./parameter";
import { Instance } from "./instance";
export declare abstract class LearningAlgorithm implements Optimizable {
    abstract learnFrom(trainingSet: Instance[]): Model;
    abstract parameters: Parameter[];
    abstract objective: () => number;
    holdOutCV(dataset: ABT, testSplit?: number, randomize?: boolean, parallel?: boolean): number;
}
