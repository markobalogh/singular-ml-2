import * as _ from 'lodash';
export {mean} from 'lodash';

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

export function deepCopy<someType>(obj:someType):someType {
    let returnObj:someType = JSON.parse(JSON.stringify(obj));
    return returnObj
}

export function randomSample<someType>(collection:someType[], numberOfSamples:number):someType[] {
    return _.sampleSize(collection, numberOfSamples);
}
