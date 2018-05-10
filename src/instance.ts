import {Normalization, ZScoreNormalization} from './normalization';

export class Instance {
    constructor(public values:number[], public normalizations?:Normalization[]) {
        if (normalizations) {
            if (normalizations.length != values.length) {
                throw new Error('Instance.normalizations must have the same length as Instance.values.');
            }
        }
    }

    /**
     * Normalizes each value of the instance with respect to each of the given normalizations, respectively. If the instance is already normalized (e.g. by instance.normalization), it is denormalized and renormalized with the new normalization.
     * 
     * Returns the normalized instance for chaining.
     */
    normalize(normalizations:Normalization[]):Instance {
        if (this.normalizations) {
            this.denormalize();
        }
        this.normalizations = normalizations;
        this.values = this.values.map((value,index)=>{
            return (<Normalization[]>this.normalizations)[index].normalize(value);
        })
        return this;
    }

    /**
     * Denormalizes the instance with respect to its normalizations. If the instance's normalizations are undefined, an error is thrown.
     * 
     * Returns the normalized instance for chaining.
     */
    denormalize():Instance {
        if (this.normalizations == undefined) {
            throw new Error('No normalizations are defined for this instance.');
        } else {
            this.values = this.values.map((value,index)=>{
                return (<Normalization[]>this.normalizations)[index].denormalize(value);
            });
            this.normalizations = undefined; //clear the old normalization since the instance is now denormalized.
            return this;
        }
    }

    /**
     * Returns the index for which there is a value missing (NaN) in this instance, and -1 if none are missing.
     */
    getMissingFeatureIndex():number {
        return this.values.findIndex(value=>isNaN(value));
    }

    fillMissingFeatureValue(value:number) {
        this.values[this.getMissingFeatureIndex()] = value;
    }
}