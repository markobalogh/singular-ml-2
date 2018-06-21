import { Instance } from './instance';
import { Prediction } from './prediction';
/**
 * Docs not written yet.
 */
export declare abstract class Model {
    /**
     * The convention is that query instances have `NaN` values for any target indices, and do not necessarily have target indices identified (instance.targetIndices may be an empty array).
     *
     * An instance might not be provided in the case of a generative model, or, if an instance is provided to a generative model, the returned value is the likelihood of the query instance under the generative model.
     */
    abstract query(instance?: Instance): Prediction;
    test(testSet: Instance[]): Prediction[];
}
