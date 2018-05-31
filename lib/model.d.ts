import { Instance } from './instance';
import { Prediction } from './prediction';
import { ABT } from '.';
import { ScoringFunction } from './scoringFunction';
/**
 * Docs not written yet.
 */
export declare abstract class Model {
    /**
     * An instance might not be provided in the case of a generative model.
     */
    abstract query(instance?: Instance): Prediction;
    abstract scoringFunction: ScoringFunction;
    test(testSet: ABT): number;
}
