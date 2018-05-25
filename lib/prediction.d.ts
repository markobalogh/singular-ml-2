import { Instance } from './instance';
import { Normalization } from './normalization';
/**
 * A Prediction is a subtype of Instance with an additional property `confidences` that can be used to pass information about the confidence a model has in each element of the prediction (if the model doesn't output such information, it is left undefined.)
 */
export declare class Prediction extends Instance {
    confidences: number[] | undefined;
    constructor(values: number[], normalizations: (Normalization | undefined)[], confidences?: number[]);
    static fromInstance(instance: Instance, confidences?: number[]): Prediction;
    /**
     * Sets all the `Prediction.confidences` values to `confidence`.
     */
    setUniformConfidence(confidence: number): this;
}
