"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abt_1 = require("./abt");
/**
 */
class FinancialABT extends abt_1.ABT {
    constructor() {
        super();
    }
    /**
     * Pushes new features to the ABT which, for the [n]th value in feature `featureName`, contain the [n-1]th, [n-2]th, [n-3]th, ... [n-windowSize]th values. The resulting instances allow for recursive self-comparison within a single feature.
     */
    generateRecursiveFeatures(featureName, windowSize) {
        for (let n = 1; n < (windowSize + 1); n++) {
            this.duplicateFeature(featureName, `${featureName}[n-${n}]`);
            this.features[this.features.length - 1].shift(n);
        }
        return this;
    }
}
exports.FinancialABT = FinancialABT;
//# sourceMappingURL=financialABT.js.map