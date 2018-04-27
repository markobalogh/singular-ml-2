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
    /**
     * Calls `query` with `instance`, replacing any `NaN`s in `instance` with a value from `sweepRange` each time. Returns an array of the query responses.
     *
     * If `instance` is empty, 100 samples from the model are generated and returned.
     */
    querySweep(instance?: Instance, sweepRange?: number[]): Prediction[];
}
