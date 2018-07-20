"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to control the behavior of parameters. When parameters are changed (by optimization algorithms for example) those changes can be monitored/controlled.
 */
class Parameter {
    constructor(value, fixed = false, lowerBound = NaN, upperBound = NaN) {
        this.value = value;
        this.fixed = fixed;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
    /**
     * Returns an array of parameters with the given `values`.
     */
    static vector(values, fixed = false, lowerBound = NaN, upperBound = NaN) {
        return values.map(value => new Parameter(value, fixed, lowerBound, upperBound));
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=parameter.js.map