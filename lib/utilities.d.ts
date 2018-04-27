export declare function stdev(values: number[], subtractOneFromDenominator?: boolean): number;
export declare function lastElementOf<someType>(array: someType[]): someType;
export declare function deepCopy<someType>(obj: someType): someType;
export declare function randomSample<someType>(collection: someType[], numberOfSamples: number): someType[];
/**
 * Returns a percentile of the given `collection`, where `percentile` is a decimal between 0 and 1. Interpolates between elements of the collection unless `interpolate` is false.
 */
export declare function percentile(collection: number[], percentile: number, interpolate?: boolean): number;
export declare function mean(collection: number[], weights?: number[]): number;
