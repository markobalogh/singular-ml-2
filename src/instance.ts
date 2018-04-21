import {Normalization, ZScoreNormalization} from './normalization';

export class Instance {
    constructor(public values:number[], public normalization?:Normalization) {
    }

    /**
     * Normalizes the instance with respect to the given normalization. If no normalization is provided, the one found at `instance.normalization` is used. If no normalization is found there, an error is thrown.
     * 
     * Returns the normalized instance for chaining.
     */
    normalize(normalization?:Normalization):Instance {
        if (normalization) {
            this.normalization = normalization;
        }
        if (this.normalization == undefined) {
            throw new Error('No normalization is defined for this instance.');
        } else {
            this.values = this.values.map((value)=>{
                return (<Normalization>this.normalization).normalize(value);
            })
            return this;
        }
    }

    /**
     * Denormalizes the instance with respect to it's normalization. If the instance's normalization is undefined, an error is thrown.
     * 
     * Returns the normalized instance for chaining.
     */
    denormalize():Instance {
        if (this.normalization == undefined) {
            throw new Error('No normalization is defined for this instance.');
        } else {
            this.values = this.values.map((value)=>{
                return (<Normalization>this.normalization).denormalize(value);
            });
            this.normalization = undefined; //clear the old normalization since the instance is now denormalized.
            return this;
        }
    }
}