import { LearningAlgorithm } from "./learningAlgorithm";
import { ABT } from "./abt";
import { Model } from './model';
export declare abstract class CrossValidator<inputType, outputType> extends Model<[LearningAlgorithm<inputType, outputType>, ABT], Model<inputType, outputType>> {
}
export declare class KFoldCrossValidator<inputType, outputType> extends CrossValidator<inputType, outputType> {
    /**
     * K is the number of folds.
     */
    constructor(k: number);
}
export declare class LeaveOneOutCrossValidator<inputType, outputType> extends CrossValidator<inputType, outputType> {
    query(input: [LearningAlgorithm<inputType, outputType>, ABT]): Model<inputType, outputType>;
}
