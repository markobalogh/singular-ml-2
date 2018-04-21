import { Normalization } from './normalization';
export declare class Instance {
    values: number[];
    normalization: Normalization | undefined;
    constructor(values: number[], normalization?: Normalization | undefined);
    /**
     * Normalizes the instance with respect to the given normalization. If no normalization is provided, the one found at `instance.normalization` is used. If no normalization is found there, an error is thrown.
     *
     * Returns the normalized instance for chaining.
     */
    normalize(normalization?: Normalization): Instance;
    /**
     * Denormalizes the instance with respect to it's normalization. If the instance's normalization is undefined, an error is thrown.
     *
     * Returns the normalized instance for chaining.
     */
    denormalize(): Instance;
}
