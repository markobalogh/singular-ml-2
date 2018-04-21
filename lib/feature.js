"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Plotter_1 = require("./Plotter");
const utilities = __importStar(require("./utilities"));
var plotter = new Plotter_1.Plotter();
class Feature {
    /**
     * Creates an instance of Feature.
     * If `allowNonNumeric` is true, values will not be converted to type `number` when the feature is constructed.
     * @memberof Feature
     */
    constructor(name, values = [], allowNonNumeric = false) {
        this.name = name;
        this.values = values;
        if (!allowNonNumeric) {
            this.values = values.map((value) => { return Number(value); });
        }
    }
    getValue(index) {
        return this.values[index];
    }
    setValue(index, newValue) {
        this.values[index] = newValue;
        return this;
    }
    getSlice(startIndex, endIndex) {
        return this.values.slice(startIndex, endIndex);
    }
    plot() {
        let xarray = [];
        for (let i = 0; i < this.values.length; i++) {
            xarray.push(i);
        }
        plotter.plot(xarray, this.values);
    }
    push(value) {
        this.values.push(value);
        return this;
    }
    extend(values) {
        this.values = this.values.concat(values);
        return this;
    }
    /**
     * Moves the indexes associated with each value in the given Feature up or down by the given shift. Positive shift values create NaNs at the beginning of Feature.values. Fills missing values that result from the shift with NaNs. Feature length is kept constant.
     */
    shift(shiftAmount) {
        if (shiftAmount > 0) {
            for (let i = 0; i < shiftAmount; i++) {
                this.values.unshift(NaN);
                this.values.pop();
            }
        }
        else {
            for (let i = 0; i < shiftAmount; i++) {
                this.push(NaN);
                this.values.shift();
            }
        }
        return this;
    }
    /**
     * Replaces each value with the derivative over the previous [window] values. Right now we don't support index features, so the derivative values will instead simply be the differentials across each window. If relative is true, then all derivatives will be normalized to a proportion of the value at the beginning of the window.
     */
    differentiate(window = 1, relative = false) {
        let newFeature = new Feature(this.name, this.values);
        if (relative) {
            newFeature.values = this.values.slice(window).map((value, index) => {
                return (this.values[index] / this.values[index - window]) - 1;
            });
        }
        else {
            newFeature.values = this.values.slice(window).map((value, index) => {
                return this.values[index] - this.values[index - window];
            });
        }
        newFeature.values.unshift(...new Array(window).fill(NaN));
        this.values = [...newFeature.values];
        return this;
    }
    /**
     * Implements the clamp transformation on the feature in place. Refer to FOML page 74. If a clamp is unspecified, then no clamp is applied on that side (upper/lower).
     */
    clamp(lowerClamp, upperClamp) {
        if (upperClamp && !lowerClamp) {
            this.values = this.values.map((value) => {
                return Math.min(value, upperClamp);
            });
        }
        else if (!upperClamp && lowerClamp) {
            this.values = this.values.map((value) => {
                return Math.max(value, lowerClamp);
            });
        }
        else if (upperClamp && lowerClamp) {
            this.values = this.values.map((value) => {
                return Math.max(Math.min(value, upperClamp), lowerClamp);
            });
        }
        return this;
    }
    /**
     * Implements the clamp transformation on the feature in place, clamping data to +/- [sigma] standard deviations from the mean.
     * @param sigma
     */
    clamp_sigma(sigma) {
        //Stores mean and std in memory instead of calculating them twice...efficiency savings for extremely large features.
        let mean = utilities.mean(this.values);
        let std = utilities.stdev(this.values);
        this.clamp((mean - (sigma * std)), (mean + (sigma * std)));
        return this;
    }
}
exports.Feature = Feature;
//# sourceMappingURL=feature.js.map