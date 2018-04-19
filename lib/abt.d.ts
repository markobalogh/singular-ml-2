import { Feature } from './feature';
export declare class ABT {
    private initData;
    /**
     * Creates a new ABT instance. You can initialize the ABT with data using this constructor or you can call `new ABT().from*****()`.
     *
     * Supported initData types:
     * - **string** (assumed to be a filename - .abt and .json will be interpreted as json, .csv and .txt will be interpreted as comma-separated values)
     * - **nested array**
     * - **array of objects**
     * - **object of arrays**
     * @param initData
     */
    features: Feature[];
    constructor(initData?: any);
    /**
     * Convenience property that allows you to access features in the ABT with `ABT._features.featureName` syntax, but **does not allow you to change any properties of the features**.
     */
    readonly _features: {
        [index: string]: Feature;
    };
    fromNestedArray(data: any[][]): ABT;
    fromFile(filename: string): ABT;
}