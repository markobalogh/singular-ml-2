import * as utilities from './utilities';
import {Feature} from './feature';
import {Instance} from './instance';
import {Prediction} from './prediction';
import {Parameter} from './parameter';
import * as filesystem from 'fs';

/**
 * Docs not written yet.
 */
export abstract class Model {
    /**
     * An instance might not be provided in the case of a generative model.
     */
    abstract query(instance?:Instance):Prediction
    
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