"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DistanceWeighting {
    /**
     * Returns the weight corresponding to the given distance.
     */
    static apply(...args) {
        return NaN;
    }
}
exports.DistanceWeighting = DistanceWeighting;
class GeneralizedGaussianDistanceWeighting extends DistanceWeighting {
    constructor() {
        super();
    }
    static apply(distance, sigma, exponent) {
        return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
    }
}
exports.GeneralizedGaussianDistanceWeighting = GeneralizedGaussianDistanceWeighting;
class ConstantDistanceWeighting extends DistanceWeighting {
    constructor() {
        super();
    }
    static apply(distance) {
        return 1;
    }
}
exports.ConstantDistanceWeighting = ConstantDistanceWeighting;
//# sourceMappingURL=distanceWeighting.js.map