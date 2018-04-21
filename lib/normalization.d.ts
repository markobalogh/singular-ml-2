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
