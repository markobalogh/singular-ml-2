import { ABT } from './abt';
/**
 */
export declare class FinancialABT extends ABT {
    constructor();
    /**
     * Pushes new features to the ABT which, for the [n]th value in feature `featureName`, contain the [n-1]th, [n-2]th, [n-3]th, ... [n-windowSize]th values. The resulting instances allow for recursive self-comparison within a single feature.
     */
    generateRecursiveFeatures(featureName: string, windowSize: number): FinancialABT;
}
