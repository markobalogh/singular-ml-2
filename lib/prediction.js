"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("./instance");
/**
 * A Prediction is a subtype of Instance with an additional property `confidence` that can be used to pass information about the confidence a model has in the prediction (if the model doesn't output such information, it is left undefined.)
 */
class Prediction extends instance_1.Instance {
    constructor(values, normalization, confidence) {
        super(values, normalization);
        this.values = values;
        this.normalization = normalization;
        this.confidence = confidence;
    }
}
exports.Prediction = Prediction;
//# sourceMappingURL=prediction.js.map