import { Instance } from './instance';
import { Prediction } from './prediction';
import { ScoringFunction } from './scoringFunction';
/**
 * Docs not written yet.
 */
export declare abstract class Model {
    /**
     * The general format of instance is that any values which are NaNs should be considered target features that should be provided by the model- hence the prediction will have no NaNs left. An instance might not be provided in the case of a generative model.
     */
    abstract query(instance?: Instance): Prediction;
    abstract scoringFunction: ScoringFunction;
    test(testSet: Instance[]): number;
}
