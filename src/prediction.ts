import {Instance} from './instance';
import { Normalization } from './normalization';

/**
 * A Prediction is a subtype of Instance with an additional property `confidences` that can be used to pass information about the confidence a model has in each element of the prediction (if the model doesn't output such information, it is left undefined.)
 */
export class Prediction extends Instance{
    confidences:number[]|undefined;
    constructor(values:number[], normalizations:(Normalization|undefined)[], confidences?:number[]) {
        super(values, normalizations);
        this.confidences = confidences
    }

    static fromInstance(instance:Instance, confidences?:number[]):Prediction {
        return new Prediction(instance.values, instance.normalizations, confidences);
    }

    /**
     * Sets all the `Prediction.confidences` values to `confidence`.
     */
    setUniformConfidence(confidence:number) {
        this.confidences = Array(this.values.length).fill(confidence);
        return this;
    }
}