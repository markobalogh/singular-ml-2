import { Instance } from './instance';
import { LoDashExplicitNumberArrayWrapper } from 'lodash';
export class DistanceWeighting {
    constructor() {}
    /**
     * Returns the weight corresponding to the given distance.
     */
    apply:any
}

export var GeneralizedGaussianDistanceWeighting = new DistanceWeighting();
GeneralizedGaussianDistanceWeighting.apply = function(distance:number, sigma:number, exponent:number){
    return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
}

// export class GeneralizedGaussianDistanceWeighting extends DistanceWeighting{
//     constructor() {
//         super();
//     }
//     static apply(distance:number, sigma:number, exponent:number):number {
//         return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
//     }
// }

export class ConstantDistanceWeighting extends DistanceWeighting {
    constructor() {
        super();
    }
    static apply(distance:number):number {
        return 1;
    }
}