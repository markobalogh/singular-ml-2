import { Model } from './model';
export declare class ABT extends Model<number, number[]> {
    /**
     * Creates a new ABT. Data can be provided directly to the constructor or supplied using I/O methods like .from****()
     */
    constructor(featureNames?: string[], instances?: number[][]);
    instances: number[][];
    featureNames: string[];
    query(input: number): number[];
    fromCSVString(csvString: string): this;
    exportAsCSV(filename?: string): this;
    /**
     * Deletes any features whose name is not listed in the arguments. Returns the new ABT for chaining.
     */
    keepFeatures(...featureNames: string[]): this;
    /**
     * Removes the feature with name `featureName` from the ABT. Returns the new ABT for chaining.
     */
    removeFeature(featureName: string): this;
    /**
     * Duplicates the feature with name `featureName` and places inserts it at the front of the ABT unless `pushToFront` is false, wherein the new feature is inserted in front of the duplicated feature.
     */
    duplicateFeature(featureName: string, newFeatureName?: string, pushToFront?: boolean): this;
    fromFile(filename: string): this;
}
