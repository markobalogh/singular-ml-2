"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
class Normalization {
}
exports.Normalization = Normalization;
//Features will typically store one normalization.
//Instances will store an array of normalizations.
class ZScoreNormalization extends Normalization {
    constructor(data) {
        super();
        this.mean = utilities_1.mean(data);
        this.stdev = utilities_1.stdev(data);
    }
    normalize(value) {
        return ((value - this.mean) / this.stdev);
    }
    denormalize(value) {
        return ((value * this.stdev) + this.mean);
    }
}
exports.ZScoreNormalization = ZScoreNormalization;
exports.ZScoreNormalizer = function (data) {
    return new ZScoreNormalization(data);
};
//# sourceMappingURL=normalization.js.map