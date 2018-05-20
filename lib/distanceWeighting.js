"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DistanceWeighting {
    constructor() { }
}
exports.DistanceWeighting = DistanceWeighting;
exports.GeneralizedGaussianDistanceWeighting = new DistanceWeighting();
exports.GeneralizedGaussianDistanceWeighting.apply = function (distance, sigma, exponent) {
    return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
};
// export class GeneralizedGaussianDistanceWeighting extends DistanceWeighting{
//     constructor() {
//         super();
//     }
//     static apply(distance:number, sigma:number, exponent:number):number {
//         return Math.exp(-1 * Math.pow(distance, exponent) / Math.pow(sigma, exponent));
//     }
// }
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