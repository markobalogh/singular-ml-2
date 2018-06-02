import * as _ from 'lodash';
import crypto = require('crypto');

export function stdev(values:number[], subtractOneFromDenominator:boolean=true):number {
    let mean = _.mean(values);
    if (subtractOneFromDenominator) {
        return Math.sqrt(_.sum(values.map((value)=>{return Math.pow((value-mean), 2)})) / (values.length-1));
    } else {
        return Math.sqrt(_.sum(values.map((value)=>{return Math.pow((value-mean), 2)})) / (values.length));
    }
}

export function lastElementOf<someType>(array:someType[]):someType {
    return array[array.length - 1];
}

/**
 * Instance methods will be copied but static/class methods will not be. Instance properties that are themselves class instances will be copied as objects (their methods will not be copied). Hence to copy those you'll need help from some static `fromObj` method (that's the API typically implemented by this library when necessary).
 */
export function flatCopy<someType>(obj:someType):someType {
    let returnObj:someType = Object.assign( Object.create( Object.getPrototypeOf(obj)), JSON.parse(JSON.stringify(obj)));
    return returnObj
}

export function randomSample<someType>(collection:someType[], numberOfSamples:number):someType[] {
    return _.sampleSize(collection, numberOfSamples);
}

/**
 * Returns a percentile of the given `collection`, where `percentile` is a decimal between 0 and 1. Interpolates between elements of the collection unless `interpolate` is false.
 */
export function percentile(collection:number[], percentile:number, interpolate=true) {
    let sortedCollection = flatCopy(collection.sort((a,b)=>{return a-b}));
    if (interpolate) {
        let lowerIndex = Math.floor(sortedCollection.length * percentile);
        let upperIndex = Math.ceil(sortedCollection.length * percentile);
        if (lowerIndex >= (sortedCollection.length - 1)) {
            return sortedCollection[sortedCollection.length - 1];
        } else {
            if (upperIndex != lowerIndex) {
                return sortedCollection[lowerIndex] + ((sortedCollection[upperIndex] - sortedCollection[lowerIndex]) * (percentile - (lowerIndex / sortedCollection.length)));
            } else {
                return sortedCollection[lowerIndex];
            }
        }
    } else {
        return sortedCollection[Math.round(sortedCollection.length * percentile)];
    }
}

export function mean(collection:number[], weights?:number[]):number {
    if (weights) {
        return _.sum(collection.map((value,index) => weights[index]*value)) / _.sum(weights);
    } else {
        return _.mean(collection);
    }
}

/**
 * Note: this is not as efficient as a synchronous map when the number of items is large. When the number of items is very small it can be equally efficient.
 */
export async function asyncMap<inputType, outputType>(items:inputType[], map:(input:inputType)=>outputType):Promise<outputType[]> {
    let promises = items.map(function(value) {
        return new Promise<outputType>((resolve,reject)=>{
            try {
                resolve(map(value));
            } catch (error) {
                reject(error);
            }
        });
    })
    return Promise.all(promises);
}

export function logExecutionTime(enabled:boolean, workload:()=>any):void {
    if (enabled) {
        let startTime = new Date().getTime();
        workload();
        let endTime = new Date().getTime();
        console.log(`Execution time: ${endTime-startTime} milliseconds.`);
    } else {
        workload();
    }
}

export function unique<someType>(array:ArrayLike<someType>):someType[] {
    return _.uniq(array);
}

export function range(length:number):number[] {
    return _.range(0, length);
}

export function shuffle<T>(collection:T[]):T[] {
    return _.shuffle(collection);
}

// /**
//  * Returns a thread-safe random number between zero and 1.
//  */
// export function safeRandom():number {
//     return _.sum(crypto.randomBytes(100))
// }