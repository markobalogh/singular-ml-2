import {Plotter} from './Plotter';
import * as utilities from './utilities';
var plotter = new Plotter();

export class Feature{
    /**
     * Creates an instance of Feature. 
     * If `allowNonNumeric` is true, values will not be converted to type `number` when the feature is constructed.
     * @memberof Feature
     */
    constructor(public name:string, public values:any[]=[], allowNonNumeric:boolean=false) {
        if (!allowNonNumeric) {
            this.values = values.map((value)=>{return Number(value)});
        }
    }

    getValue(index:number):number {
        return this.values[index];
    }

    setValue(index:number, newValue:number):Feature {
        this.values[index] = newValue;
        return this;
    }

    getSlice(startIndex:number, endIndex:number):number[] {
        return this.values.slice(startIndex, endIndex);
    }

    plot():void {
        let xarray = []
        for (let i=0; i < this.values.length;i++) {
            xarray.push(i);
        }
        plotter.plot(xarray, this.values)
    }

    push(value:number):Feature {
        this.values.push(value);
        return this;
    }

    extend(values:number[]):Feature {
        this.values = this.values.concat(values);
        return this;
    }

    /**
     * Moves the indexes associated with each value in the given Feature up or down by the given shift. Positive shift values create NaNs at the beginning of Feature.values. Fills missing values that result from the shift with NaNs. Feature length is kept constant.
     */
    shift(shiftAmount:number):Feature {
        if (shiftAmount > 0) {
            for (let i=0;i<shiftAmount;i++) {
                this.values.unshift(NaN)
                this.values.pop();
            }
        } else {
            for (let i=0;i<shiftAmount;i++) {
                this.push(NaN);
                this.values.shift();
            }
        }
        return this;
    }

    /**
     * Replaces each value with the derivative over the previous [window] values. Right now we don't support index features, so the derivative values will instead simply be the differentials across each window. If relative is true, then all derivatives will be normalized to a proportion of the value at the beginning of the window.
     */
    differentiate(window:number=1, relative:boolean=false):Feature {
        let newFeature = new Feature(this.name, this.values);
        if (relative) {
            newFeature.values = this.values.slice(window).map((value,index)=>{
                return (this.values[index] / this.values[index-window])-1;
            });
        } else {
            newFeature.values = this.values.slice(window).map((value,index)=>{
                return this.values[index] - this.values[index-window]
            });
        }
        newFeature.values.unshift(...new Array(window).fill(NaN));
        this.values = [...newFeature.values];
        return this;
    }

    /**
     * Implements the clamp transformation on the feature in place. Refer to FOML page 74. If a clamp is unspecified, then no clamp is applied on that side (upper/lower).
     */

    clamp(lowerClamp?:number,upperClamp?:number):Feature {
        if (upperClamp && !lowerClamp) {
            this.values = this.values.map((value)=>{
                return Math.min(value, upperClamp);
            });
        } else if (!upperClamp && lowerClamp) {
            this.values = this.values.map((value)=>{
                return Math.max(value, lowerClamp);
            });
        } else if (upperClamp && lowerClamp) {
            this.values = this.values.map((value)=>{
                return Math.max(Math.min(value, upperClamp), lowerClamp);
            });
        }
        return this;
    }

    /**
     * Implements the clamp transformation on the feature in place, clamping data to +/- [sigma] standard deviations from the mean.
     * @param sigma 
     */
    clamp_sigma(sigma:number):Feature {
        //Stores mean and std in memory instead of calculating them twice...efficiency savings for extremely large features.
        let mean = utilities.mean(this.values);
        let std = utilities.stdev(this.values);
        this.clamp((mean - (sigma*std)), (mean + (sigma*std)));
        return this;
    }
}

// let x = new Feature('myfeature', [1,2,3,4,5,6]); 
// console.log(x.shift(2).extend([1,2,3]));
