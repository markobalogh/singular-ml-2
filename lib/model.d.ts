import { Instance } from './instance';
import { Prediction } from './prediction';
/**
 * Docs not written yet.
 */
export declare abstract class Model {
    /**
     * An instance might not be provided in the case of a generative model.
     */
    abstract query(instance?: Instance): Prediction;
}
