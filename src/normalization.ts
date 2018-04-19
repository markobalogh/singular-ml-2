import {mean, stdev} from './utilities';

export abstract class Normalization {
    abstract normalize(value:number):number
    abstract denormalize(value:number):number
}

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