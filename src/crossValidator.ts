import { LearningAlgorithm } from "./learningAlgorithm";
import { ABT } from "./abt";
import { Model } from './model';

//A cross validator is a model mapping a learning algorithm and an ABT to a cross validated model.

export abstract class CrossValidator<inputType,outputType> extends Model<[LearningAlgorithm<inputType, outputType>,ABT], Model<inputType,outputType>> {

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