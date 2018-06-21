"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
class Instance {
    /**
     * Creates a new Instance. If `normalizations` is not provided, all the normalizations will be `undefined`, indicating that the values have not been normalized.
     */
    constructor(values, normalizations = values.map(value => undefined)) {
        this.values = values;
        this.normalizations = normalizations;
        /**
         * The indices at which `this.values` contains target feature values. An instance does not have to have any target feature values (e.g. in the case of generative modeling).
         */
        this.targetIndices = [];
        if (normalizations) {
            if (normalizations.length != values.length) {
                throw new Error('Instance.normalizations must have the same length as Instance.values.');
            }
        }
    }
    static fromObj(obj) {
        let newinstance = new Instance([]);
        newinstance = Object.assign(newinstance, obj);
        newinstance.normalizations = obj.normalizations.map((value) => utilities_1.flatCopy(value));
        return newinstance;
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
     * Denormalizes the instance with respect to its normalizations. Does nothing for undefined normalizations.
     *
     * Returns the normalized instance for chaining.
     */
    denormalize() {
        this.values = this.values.map((value, index) => {
            if (this.normalizations[index]) {
                return this.normalizations[index].denormalize(value);
            }
            else {
                return value;
            }
        });
        this.normalizations.forEach(normalization => normalization = undefined); //clear the old normalization since the instance is now denormalized.
        return this;
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
    get targetValues() {
        return this.values.filter((value, index) => this.targetIndices.includes(index));
    }
}
exports.Instance = Instance;
//# sourceMappingURL=instance.js.map