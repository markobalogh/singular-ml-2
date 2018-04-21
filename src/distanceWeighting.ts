import { Instance } from './instance';
export class DistanceWeighting {
    constructor() {}

    evaluate(instanceA:Instance, instanceB:Instance):number {
        return NaN; //this method should be overridden by individual instances of this class.
    }
}