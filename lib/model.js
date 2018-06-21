"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Docs not written yet.
 */
class Model {
    test(testSet) {
        return this.scoringFunction(testSet, testSet.map(instance => this.query(instance)));
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map