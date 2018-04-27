export declare abstract class DistanceWeighting {
    /**
     * Returns the weight corresponding to the given distance.
     */
    static apply(...args: any[]): number;
}
export declare class GeneralizedGaussianDistanceWeighting extends DistanceWeighting {
    constructor();
    static apply(distance: number, sigma: number, exponent: number): number;
}
export declare class ConstantDistanceWeighting extends DistanceWeighting {
    constructor();
    static apply(distance: number): number;
}
