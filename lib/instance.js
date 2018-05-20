"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    /**
     * Creates a new Instance. If `normalizations` is not provided, all the normalizations will be `undefined`, indicating that the values have not been normalized.
     */
    constructor(values, normalizations = values.map(value => undefined)) {
        this.values = values;
        this.normalizations = normalizations;
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
    normalize(normalizations) {
        if (this.normalizations) {
            this.denormalize();
        }
        this.normalizations = normalizations;
        this.values = this.values.map((value, index) => {
            if (this.normalizations[index]) {
                return this.normalizations[index].normalize(value);
            }
            else {
                //new normalization is undefined for this index, so dont apply any transformation.
                return value;
            }
        });
        return this;
    }
    /**
     * Denormalizes the instance with respect to its normalizations. If the instance's normalizations are undefined, an error is thrown.
     *
     * Returns the normalized instance for chaining.
     */
    denormalize() {
        if (this.normalizations == undefined) {
            throw new Error('No normalizations are defined for this instance.');
        }
        else {
            this.values = this.values.map((value, index) => {
                return this.normalizations[index].denormalize(value);
            });
            this.normalizations.forEach(normalization => normalization = undefined); //clear the old normalization since the instance is now denormalized.
            return this;
        }
    }
    /**
     * Returns the index for which there is a value missing (NaN) in this instance, and -1 if none are missing.
     */
    getMissingFeatureIndex() {
        return this.values.findIndex(value => isNaN(value));
    }
    fillMissingFeatureValue(value) {
        this.values[this.getMissingFeatureIndex()] = value;
        return this;
    }
}
exports.Instance = Instance;
//# sourceMappingURL=instance.js.map