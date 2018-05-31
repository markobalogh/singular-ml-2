import { ABT } from ".";
import { Model } from './model';
export declare abstract class LearningAlgorithm {
    abstract learnFrom(trainingSet: ABT): Model;
    holdOutCV(dataSet: ABT, testSplit?: number): number;
}
