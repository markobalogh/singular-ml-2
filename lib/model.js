"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Docs not written yet.
 */
class Model {
    test(testSet) {
        return testSet.map((instance) => {
            return this.query(instance.removeTargetValues());
        });
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map