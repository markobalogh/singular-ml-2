import * as utilities from './utilities';
import {Feature} from './feature';
import {Instance} from './instance';
import {Prediction} from './prediction';
import {Parameter} from './parameter';
import * as filesystem from 'fs';
import { Optimizable } from './optimizer';
import { ABT } from '.';
import { ScoringFunction } from './scoringFunction';

/**
 * Docs not written yet.
 */
export abstract class Model {
    /**
     * The convention is that query instances have `NaN` values for any target indices, and do not necessarily have target indices identified (instance.targetIndices may be an empty array).
     * 
     * An instance might not be provided in the case of a generative model, or, if an instance is provided to a generative model, the returned value is the likelihood of the query instance under the generative model.
     */
    abstract query(instance?:Instance):Prediction

    test(testSet:Instance[]):Prediction[] {
        return testSet.map((instance)=>{
            return this.query(instance.removeTargetValues());
        });
    }
    
    // abstract parameters:Parameter[]; //deemed not necessary at this time since it is easy enough to iterate through class properties and check if they are parameters or not.

    /**
     * Calls `query` with `instance`, replacing any `NaN`s in `instance` with a value from `sweepRange` each time. Returns an array of the query responses.
     * 
     * If `instance` is empty, 100 samples from the model are generated and returned.
     */
    // querySweep(instance?:Instance, sweepRange?:number[]):Prediction[] {
    //     let returnArray:Prediction[] = [];
    //     if (instance) {
    //         if (sweepRange) {
    //             returnArray = sweepRange.map((value)=>{
    //                 let newInstance = utilities.deepCopy(instance);
    //                 newInstance.values.forEach((instanceValue,index)=>{
    //                     if (isNaN(instanceValue)) {
    //                         instance.values[index] = value;
    //                     }
    //                 });
    //                 return this.query(newInstance);
    //             });
    //         }
    //     } else {
    //         //just return sweepRange.length samples
    //         for (let i=0;i<100;i++) {
    //             returnArray.push(this.query());
    //         }
    //     }
    //     return returnArray;
    // }
}