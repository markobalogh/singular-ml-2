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
}
