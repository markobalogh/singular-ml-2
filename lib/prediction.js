"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("./instance");
/**
 * A Prediction is a subtype of Instance with an additional property `confidences` that can be used to pass information about the confidence a model has in each element of the prediction (if the model doesn't output such information, it is left undefined.)
 */
class Prediction extends instance_1.Instance {
    constructor(values, normalizations, confidences) {
        super(values, normalizations);
        this.confidences = confidences;
    }
    static fromInstance(instance, confidences) {
        return new Prediction(instance.values, instance.normalizations, confidences);
    }
    /**
     * Sets all the `Prediction.confidences` values to `confidence`.
     */
    setUniformConfidence(confidence) {
        this.confidences = Array(this.values.length).fill(confidence);
        return this;
    }
}
exports.Prediction = Prediction;
//# sourceMappingURL=prediction.js.map