import { Normalization } from './normalization';
export declare class Instance {
    values: number[];
    normalizations: (Normalization | undefined)[];
    /**
     * Creates a new Instance. If `normalizations` is not provided, all the normalizations will be `undefined`, indicating that the values have not been normalized.
     */
    constructor(values: number[], normalizations?: (Normalization | undefined)[]);
    /**
     * Normalizes each value of the instance with respect to each of the given normalizations, respectively. If the instance is already normalized (e.g. by instance.normalization), it is denormalized and renormalized with the new normalization.
     *
     * Returns the normalized instance for chaining.
     */
    normalize(normalizations: (Normalization | undefined)[]): Instance;
    /**
     * Denormalizes the instance with respect to its normalizations. Does nothing for undefined normalizations.
     *
     * Returns the normalized instance for chaining.
     */
    denormalize(): Instance;
    /**
     * Returns the index for which there is a value missing (NaN) in this instance, and -1 if none are missing.
     */
    getMissingFeatureIndex(): number;
    fillMissingFeatureValue(value: number): Instance;
}
