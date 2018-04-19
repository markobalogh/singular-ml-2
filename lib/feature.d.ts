export declare class Feature {
    name: string;
    values: any[];
    /**
     * Creates an instance of Feature.
     * If `allowNonNumeric` is true, values will not be converted to type `number` when the feature is constructed.
     * @memberof Feature
     */
    constructor(name: string, values?: any[], allowNonNumeric?: boolean);
    getValue(index: number): number;
    setValue(index: number, newValue: number): Feature;
    getSlice(startIndex: number, endIndex: number): number[];
    plot(): void;
    push(value: number): Feature;
    extend(values: number[]): Feature;
    /**
     * Moves the indexes associated with each value in the given Feature up or down by the given shift. Positive shift values create NaNs at the beginning of Feature.values. Fills missing values that result from the shift with NaNs. Feature length is kept constant.
     */
    shift(shiftAmount: number): Feature;
    /**
     * Replaces each value with the derivative over the previous [window] values. Right now we don't support index features, so the derivative values will instead simply be the differentials across each window. If relative is true, then all derivatives will be normalized to a proportion of the value at the beginning of the window.
     */
    differentiate(window?: number, relative?: boolean): Feature;
    /**
     * Implements the clamp transformation on the feature in place. Refer to FOML page 74. If a clamp is unspecified, then no clamp is applied on that side (upper/lower).
     */
    clamp(lowerClamp?: number, upperClamp?: number): Feature;
    /**
     * Implements the clamp transformation on the feature in place, clamping data to +/- [sigma] standard deviations from the mean.
     * @param sigma
     */
    clamp_sigma(sigma: number): Feature;
}
