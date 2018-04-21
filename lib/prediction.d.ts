import { Instance } from './instance';
import { Normalization } from './normalization';
/**
 * A Prediction is a subtype of Instance with an additional property `confidence` that can be used to pass information about the confidence a model has in the prediction (if the model doesn't output such information, it is left undefined.)
 */
export declare class Prediction extends Instance {
    values: number[];
    normalization: Normalization | undefined;
    confidence: number[] | undefined;
    constructor(values: number[], normalization?: Normalization | undefined, confidence?: number[] | undefined);
}
