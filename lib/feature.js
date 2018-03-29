"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plotter_1 = require("./Plotter");
var plotter = new Plotter_1.Plotter();
class Feature {
    /**
     * Creates an instance of Feature.
     * @memberof Feature
     */
    constructor(name, values = []) {
        this.name = name;
        this.values = values;
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
}
exports.Feature = Feature;
// let x = new Feature('myfeature', [1,2,3,4,5,6]); 
// console.log(x.shift(2).extend([1,2,3]));
//# sourceMappingURL=feature.js.map