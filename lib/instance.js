"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    constructor(values, normalization) {
        this.values = values;
        this.normalization = normalization;
    }
    /**
     * Normalizes the instance with respect to the given normalization. If no normalization is provided, the one found at `instance.normalization` is used. If no normalization is found there, an error is thrown.
     *
     * Returns the normalized instance for chaining.
     */
    normalize(normalization) {
        if (normalization) {
            this.normalization = normalization;
        }
        if (this.normalization == undefined) {
            throw new Error('No normalization is defined for this instance.');
        }
        else {
            this.values = this.values.map((value) => {
                return this.normalization.normalize(value);
            });
            return this;
        }
    }
    /**
     * Denormalizes the instance with respect to it's normalization. If the instance's normalization is undefined, an error is thrown.
     *
     * Returns the normalized instance for chaining.
     */
    denormalize() {
        if (this.normalization == undefined) {
            throw new Error('No normalization is defined for this instance.');
        }
        else {
            this.values = this.values.map((value) => {
                return this.normalization.denormalize(value);
            });
            this.normalization = undefined; //clear the old normalization since the instance is now denormalized.
            return this;
        }
    }
}
exports.Instance = Instance;
//# sourceMappingURL=instance.js.map