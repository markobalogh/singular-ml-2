"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
//A cross validator is a model mapping a learning algorithm and an ABT to a cross validated model.
class CrossValidator extends model_1.Model {
}
exports.CrossValidator = CrossValidator;
class KFoldCrossValidator extends CrossValidator {
    /**
     * K is the number of folds.
     */
    constructor(k) {
        super();
    }
}
exports.KFoldCrossValidator = KFoldCrossValidator;
class LeaveOneOutCrossValidator extends CrossValidator {
    query(input) {
    }
}
exports.LeaveOneOutCrossValidator = LeaveOneOutCrossValidator;
//# sourceMappingURL=crossValidator.js.map