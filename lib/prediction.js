"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("./instance");
/**
 * A Prediction is a subtype of Instance with an additional property `confidence` that can be used to pass information about the confidence a model has in the prediction (if the model doesn't output such information, it is left undefined.)
 */
class Prediction extends instance_1.Instance {
    constructor(instance, confidence) {
        super(instance.values, instance.normalizations);
        this.values = instance.values;
        this.normalizations = instance.normalizations;
    }
}
exports.Prediction = Prediction;
//# sourceMappingURL=prediction.js.map