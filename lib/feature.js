"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plotter_1 = require("./Plotter");
var plotter = new Plotter_1.Plotter();
var Feature = /** @class */ (function () {
    /**
     * Creates an instance of Feature.
     * @memberof Feature
     */
    function Feature(name, values) {
        if (values === void 0) { values = []; }
        this.name = name;
        this.values = values;
    }
    Feature.prototype.getValue = function (index) {
        return this.values[index];
    };
    Feature.prototype.setValue = function (index, newValue) {
        this.values[index] = newValue;
        return this;
    };
    Feature.prototype.getSlice = function (startIndex, endIndex) {
        return this.values.slice(startIndex, endIndex);
    };
    Feature.prototype.plot = function () {
        var xarray = [];
        for (var i = 0; i < this.values.length; i++) {
            xarray.push(i);
        }
        plotter.plot(xarray, this.values);
    };
    Feature.prototype.push = function (value) {
        this.values.push(value);
        return this;
    };
    Feature.prototype.extend = function (values) {
        this.values = this.values.concat(values);
        return this;
    };
    /**
     * Moves the indexes associated with each value in the given Feature up or down by the given shift. Positive shift values create NaNs at the beginning of Feature.values. Fills missing values that result from the shift with NaNs. Feature length is kept constant.
     */
    Feature.prototype.shift = function (shiftAmount) {
        if (shiftAmount > 0) {
            for (var i = 0; i < shiftAmount; i++) {
                this.values.unshift(NaN);
                this.values.pop();
            }
        }
        else {
            for (var i = 0; i < shiftAmount; i++) {
                this.push(NaN);
                this.values.shift();
            }
        }
        return this;
    };
    return Feature;
}());
exports.Feature = Feature;
// let x = new Feature('myfeature', [1,2,3,4,5,6]); 
// console.log(x.shift(2).extend([1,2,3]));
//# sourceMappingURL=feature.js.map