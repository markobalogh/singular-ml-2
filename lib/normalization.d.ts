export declare abstract class Normalization {
    abstract normalize(value: number): number;
    abstract denormalize(value: number): number;
}
export declare class ZScoreNormalization extends Normalization {
    private mean;
    private stdev;
    constructor(data: number[]);
    normalize(value: number): number;
    denormalize(value: number): number;
}
/**
 * A normalizer is an algorithm that generates a `Normalization` from a set of data.
 */
export declare type Normalizer = (data: number[]) => Normalization;
export declare var ZScoreNormalizer: Normalizer;
