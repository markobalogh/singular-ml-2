import { Instance } from './instance';
import { LoDashExplicitNumberArrayWrapper } from 'lodash';
export abstract class DistanceWeighting {
    /**
     * Returns the weight corresponding to the given distance.
     */
    static apply(...args:any[]):number {
        return NaN
    }
}

export class GeneralizedGaussianDistanceWeighting extends DistanceWeighting{
    constructor() {
        super();
    }
    static apply(distance:number, sigma:number, exponent:number):number {
        return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
    }
}

export class ConstantDistanceWeighting extends DistanceWeighting {
    constructor() {
        super();
    }
    static apply(distance:number):number {
        return 1;
    }
}