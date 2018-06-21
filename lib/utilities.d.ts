export declare function stdev(values: number[], subtractOneFromDenominator?: boolean): number;
export declare function lastElementOf<someType>(array: someType[]): someType;
/**
 * Instance methods will be copied but static/class methods will not be. Instance properties that are themselves class instances will be copied as objects (their methods will not be copied). Hence to copy those you'll need help from some static `fromObj` method (that's the API typically implemented by this library when necessary).
 */
export declare function flatCopy<someType>(obj: someType): someType;
export declare function randomSample<someType>(collection: someType[], numberOfSamples: number): someType[];
/**
 * Returns a percentile of the given `collection`, where `percentile` is a decimal between 0 and 1. Interpolates between elements of the collection unless `interpolate` is false.
 */
export declare function percentile(collection: number[], percentile: number, interpolate?: boolean): number;
export declare function mean(collection: number[], weights?: number[]): number;
/**
 * Note: this is not as efficient as a synchronous map when the number of items is large. When the number of items is very small it can be equally efficient.
 */
export declare function asyncMap<inputType, outputType>(items: inputType[], map: (input: inputType) => outputType): Promise<outputType[]>;
export declare function logExecutionTime(enabled: boolean, workload: () => any): void;
export declare function unique<someType>(array: ArrayLike<someType>): someType[];
export declare function range(length: number): number[];
export declare function shuffle<T>(collection: T[]): T[];
export declare function filterUndefined<T>(collection: (T | undefined)[]): T[];
