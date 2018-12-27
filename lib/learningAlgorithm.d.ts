import { ABT } from ".";
import { Model } from './model';
export declare abstract class LearningAlgorithm extends Model<ABT, Model<number[], {
    prediction: number;
    confidence: number;
}[]>> {
}
