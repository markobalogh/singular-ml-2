"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    constructor(values, normalization) {
        this.values = values;
        this.normalization = normalization;
    }
    /**
     * Normalizes the instance with respect to the given normalization. If the instance is already normalized (e.g. by instance.normalization), it is denormalized and renormalized with the new normalization.
     *
     * Returns the normalized instance for chaining.
     */
    normalize(normalization) {
        if (this.normalization) {
            this.denormalize();
        }
        this.normalization = normalization;
        this.values = this.values.map((value) => {
            return this.normalization.normalize(value);
        });
        return this;
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