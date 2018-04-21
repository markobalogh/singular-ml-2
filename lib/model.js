"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const utilities = __importStar(require("./utilities"));
/**
 * Docs not written yet.
 */
class Model {
    /**
     * Calls `query` with `instance`, replacing any `NaN`s in `instance` with a value from `sweepRange` each time. Returns an array of the query responses.
     *
     * If `instance` is empty, 100 samples from the model are generated and returned.
     */
    querySweep(instance, sweepRange) {
        let returnArray = [];
        if (instance) {
            if (sweepRange) {
                returnArray = sweepRange.map((value) => {
                    let newInstance = utilities.deepCopy(instance);
                    newInstance.values.forEach((instanceValue, index) => {
                        if (isNaN(instanceValue)) {
                            instance.values[index] = value;
                        }
                    });
                    return this.query(newInstance);
                });
            }
        }
        else {
            //just return sweepRange.length samples
            for (let i = 0; i < 100; i++) {
                returnArray.push(this.query());
            }
        }
        return returnArray;
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map