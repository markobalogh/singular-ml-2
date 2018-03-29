export declare class Feature {
    name: string;
    values: number[];
    /**
     * Creates an instance of Feature.
     * @memberof Feature
     */
    constructor(name: string, values?: number[]);
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
}
