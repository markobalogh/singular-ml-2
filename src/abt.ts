import * as utilities from './utilities';
import {Feature} from './feature';
import * as filesystem from 'fs';

export class ABT {
    /**
     * Creates a new ABT instance. You can initialize the ABT with data using this constructor or you can call `new ABT().from*****()`.
     * 
     * Supported initData types:
     * - **string** (assumed to be a filename - .abt and .json will be interpreted as json, .csv and .txt will be interpreted as comma-separated values)
     * - **nested array** 
     * - **array of objects**
     * - **object of arrays**
     * @param initData 
     */
    features:Feature[] = [];
    // _features:{[index:string]:Feature} = {};
    constructor(private initData?:any) {
        if (typeof initData == 'string') {
            this.fromFile(initData);
        }
        // Object.defineProperty(this, 'myfeature', {
        //     get: function():Feature {
        //         return new Feature('myfeature', [1,2,3]);
        //     },
        //     set: function(newval:Feature):void {
        //         console.log('set new value')
        //     }
        // })
    }

    // set features(value:Feature[]) {
    //     this.features = [...value];
    //     // this._features[value[0].name] = value[0];
    // }

    /**
     * Convenience property that allows you to access features in the ABT with `ABT._features.featureName` syntax, but **does not allow you to change any properties of the features**.
     */
    get _features():{[index:string]:Feature} {
        return {'hello':new Feature('hello', [1,2])}
    }

    fromNestedArray(data:any[][]):ABT {
        //Determine which axis is the instance axis and which is the feature axis.
        if (data.length >= data[0].length) {
            //assume that the first index indexes instances
            //create features
            this.features = data[0].map((value1,index1)=>{
                return new Feature(('Feature' + String(index1)), data.map((value2,index2)=>{
                    return value2[index1];
                }));
            });
        } else {
            //assume that the first index indexes features
            this.features = data.map((value,index)=>{
                return new Feature(('Feature' + String(index)), value);
            });
        }
        return this;
    }
    
    fromFile(filename:string):ABT {
        if (filename.endsWith('.abt') || filename.endsWith('.json')) {
            Object.assign(this, JSON.parse(filesystem.readFileSync(filename).toString()));
        } else if (filename.endsWith('.csv') || filename.endsWith('.txt')) {
            let filecontent = filesystem.readFileSync(filename).toString();
            let rowArray = filecontent.split('\n');
            //try to detect headers
            if (rowArray[0].length !== rowArray[1].length) {
                //first row is header row
                var headers = rowArray[0].split(',');
                var content = rowArray.slice(1).map((value)=>{
                    return value.split(',');
                });
            } else {
                var headers:string[] = [];
                var content = rowArray.map((value)=>{
                    return value.split(',');
                });
            }
            //Detect any weird ending to the file...sometimes the last row is just an endline character and that messes things up
            if (content[content.length-1].length !== content[content.length-2].length) {
                //Chop off the last row if so.
                content.pop();
            }
            //now, make sure each row has the same number of cells.
            console.assert((new Set(content.map((value)=>{return value.length}))).size == 1, 'Unable to create ABT from CSV file: inconsistent number of columns across rows.');
            //load data into ABT.
        }   
        return this;
    }

}

let x = new ABT();
x.features = [new Feature('hello', [1,2,3])];
x._features.hello.name = 'yo';
console.log(x.features[0].name);