export declare class DistanceWeighting {
    constructor();
    /**
     * Returns the weight corresponding to the given distance.
     */
    apply: any;
}
export declare var GeneralizedGaussianDistanceWeighting: DistanceWeighting;
export declare class ConstantDistanceWeighting extends DistanceWeighting {
    constructor();
    static apply(distance: number): number;
}
