import { LearningAlgorithm } from './learningAlgorithm';
import { ABT } from "./abt";
import { Model } from './model';
import { TestResult } from './scoringFunction';
import { range, shuffle } from "./utilities";


//A cross validator is a model mapping a learning algorithm and an ABT to a cross validated score

export abstract class CrossValidator<inputType,outputType> extends Model<[LearningAlgorithm<inputType, outputType>,ABT], TestResult[]> {
    abstract query(input:[LearningAlgorithm<inputType,outputType>, ABT]):TestResult[]
}

export class HoldOutCrossValidator extends CrossValidator<number[], number[]> {

    /**
     * `testSplit` is the proportion of the incoming ABT that will be held out as the test set.
     * `randomize` determines whether the test set contains instances randomly sampled from the ABT (default). Otherwise the test set consists of a contiguous slice of the ABT.
     */
    constructor(public testSplit:number=0.3, public randomize:boolean=true, public informationContaminationOffset:number=0) {
        super();
    }

    query(input:[LearningAlgorithm<number[], number[]>, ABT]):TestResult[] {
        //slice dataset into a test set and training set.
        let indices = range(input[1].instances.length);
        if (this.randomize) {
            indices = shuffle(indices);
        }
        let testSetSize = Math.ceil(this.testSplit * indices.length);
        let testSet = (indices.slice(0, testSetSize)).map(index=>input[1].query(index));
        let trainingSet = indices.slice(testSetSize + Math.abs(this.informationContaminationOffset), indices.length).map(index=>input[1].query(index));
        let model = input[0].query(input[1].instances);
        return trainingSet.map(value=>model.query(value))
        return new TestResults(testSet, this.learnFrom(trainingSet).test(testSet));
    }
}

export class KFoldCrossValidator<inputType,outputType> extends CrossValidator<inputType,outputType> {
    /**
     * K is the number of folds.
     */
    constructor(k:number) {
        super();
    }
}

export class LeaveOneOutCrossValidator<inputType,outputType> extends CrossValidator<inputType,outputType> {
    query(input:[LearningAlgorithm<inputType,outputType>, ABT]):Model<inputType,outputType> {

    }
}