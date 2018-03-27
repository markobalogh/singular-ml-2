import {Plotter} from './Plotter';
var plotter = new Plotter();

export class Feature{
    /**
     * Creates an instance of Feature.
     * @memberof Feature
     */
    constructor(public name:string, public values:number[]=[]) {

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

    // differentiate(window:number=1, relative:boolean=false):Feature {

    // }

}

// let x = new Feature('myfeature', [1,2,3,4,5,6]); 
// console.log(x.shift(2).extend([1,2,3]));