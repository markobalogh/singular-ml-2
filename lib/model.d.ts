import { Instance } from './instance';
import { Prediction } from './prediction';
import { Optimizable } from './optimizer';
/**
 * Docs not written yet.
 */
export declare abstract class Model implements Optimizable {
    /**
     * An instance might not be provided in the case of a generative model.
     */
    abstract query(instance?: Instance): Prediction;
}
