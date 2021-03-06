import {mean, stdev} from './utilities';
import { Instance } from './instance';

export abstract class Normalization {
    abstract normalize(value:number):number
    abstract denormalize(value:number):number
}

//Features will typically store one normalization.
//Instances will store an array of normalizations.


export class ZScoreNormalization extends Normalization{
    private mean:number;
    private stdev:number;
    constructor(data:number[]) {
        super();
        this.mean = mean(data);
        this.stdev = stdev(data);
    }

    normalize(value:number):number {
        return ((value - this.mean) / this.stdev);
    }

    denormalize(value:number):number {
        return ((value * this.stdev) + this.mean);
    }
}

/**
 * A normalizer is an algorithm that generates a `Normalization` from a set of data.
 */
export type Normalizer = (data:number[]) => Normalization;

export var ZScoreNormalizer:Normalizer = function(data:number[]) {
    return new ZScoreNormalization(data);
}

