import { Feature } from './feature';
import { Instance } from './instance';
export declare class ABT {
    features: Feature[];
    /**
     * Indicates how instances in the ABT are contaminated with information from other instances. If 0, there is no contamination. If 1, then instance n+1 is contaminated with information from instance n. If -1, then instance n-1 is contaminated with information from instance n. This offset is used to ensure that trainingSet/testSet partitions are information-safe.
     */
    informationContaminationOffset: number;
    /**
     * Creates a new ABT instance. To initialize the ABT with data you can call `new ABT().from*****()`.
     */
    constructor();
    static fromObj(obj: any): ABT;
    /**
     * Returns a *new* ABT that is an exact copy of `this`.
     */
    copy(): this;
    fromNestedArray(data: any[][]): this;
    fromObjectOfArrays(data: {
        [index: string]: any[];
    }): this;
    fromArrayOfObjects(data: {
        [index: string]: any;
    }[]): this;
    fromFile(filename: string): this;
    save(filename?: string): this;
    exportAsCSV(filename?: string): this;
    /**
     * Convenience property that allows you to access features in the ABT with `ABT._features.featureName` syntax, but **does not allow you to change any properties of the features**. UPDATE: apparently you actually can change properties of features this way.
     */
    readonly _features: {
        [index: string]: Feature;
    };
    featureByName(featureName: string): Feature;
    [Symbol.iterator](): {
        next: () => IteratorResult<Instance>;
    };
    /**
     * The number of instances stored in this ABT. It is assumed that all features have the same length.
     */
    readonly length: number;
    /**
     * Deletes any features whose name is not listed in `featureNames`. Returns the new ABT for chaining.
     */
    keepFeatures(...featureNames: string[]): this;
    /**
     * Removes the feature with name `featureName` from the ABT. Returns the new ABT for chaining.
     */
    removeFeature(featureName: string): this;
    /**
     * Duplicates the feature with name `featureName` and pushed the feature to the end of `ABT.features` unless `pushToEnd` is false.
     */
    duplicateFeature(featureName: string, newFeatureName?: string, pushToEnd?: boolean): this;
    getInstance(index: number): Instance;
    /**
     * Pushes instance onto this ABT. Forces the instance to take on the same normalization as the ABT. Throws an error if the instance is incompatible with this ABT.
     *
     */
    pushInstance(instance: Instance): this;
    /**
     * Removes any instances that violate the given `condition`. Returns the ABT for chaining.
     */
    keepInstances(condition: (instance: Instance, index: number) => boolean): this;
    /**
     * Removes any instances which contain `NaN`.
     */
    removeNaNs(): this;
    /**
     * Use this property only for debugging purposes or iterating through all instances. If you know which instance you need, call ABT.getInstance() because this property dynamically regenerates the entire array of instances for each call.
     */
    readonly instances: Instance[];
    /**
     * Get multiple instances.
     */
    getInstances(indices: number[]): Instance[];
    /**
     * Returns a *new* copy of this ABT which contains only the instances at the given indices.
     */
    getSubset(indices: number[]): this;
    /**
     * Returns a consecutive subset of `this` from `startIndex` up to but not including `endIndex`. The default `startIndex` is 0 and the default `endIndex` is `this.length`.
     */
    getSlice(startIndex?: number, endIndex?: number): this;
    /**
     * Let's see if we can make this function return an object that is indexed by the values returned by `condition`. I think a plain JS object can't do it because indices have to be numbers or strings. Maybe a map?
     */
    partition<T>(condition: (instance: Instance, index: number) => T): Map<T, this>;
}
