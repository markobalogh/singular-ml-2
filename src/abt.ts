import * as utilities from './utilities';
import {Feature} from './feature';
import * as filesystem from 'fs';
import { deepCopy, unique, range } from './utilities';
import { Instance } from './instance';

export class ABT {
    features:Feature[] = [];
    
    /**
     * Creates a new ABT instance. To initialize the ABT with data you can call `new ABT().from*****()`.
     */
    constructor() {
        
    }

    ///////////////////////////////// I/O //////////////////////////////////

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

    fromObjectOfArrays(data:{[index:string]:any[]}):ABT {
        this.features = [];
        for (let featureName in data) {
            this.features.push(new Feature(featureName, data[featureName]));
        }
        return this;
    }

    fromArrayOfObjects(data:{[index:string]:any}[]):ABT {
        this.features = [];
        for (let featureName in data[0]) {
            this.features.push(new Feature(featureName, data.map((value)=>{return value[featureName]})));
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
            this.fromNestedArray(content);
            //set names equal to headers if possible
            if (headers.length != 0) {
                this.features.forEach((value, index)=>{
                    this.features[index].name = headers[index];
                });
            }
        }   
        return this;
    }

    save(filename:string='untitled.abt'):ABT {
        filesystem.writeFileSync(filename, JSON.stringify(this));
        return this;
    }

    ////////////////////////// CORE FUNCTIONALITY ////////////////////////////


    /**
     * Convenience property that allows you to access features in the ABT with `ABT._features.featureName` syntax, but **does not allow you to change any properties of the features**. UPDATE: apparently you actually can change properties of features this way.
     */
    get _features():{[index:string]:Feature} {
        let returnedObj:{[index:string]:Feature} = {};
        for (let i=0;i<this.features.length;i++) {
            returnedObj[this.features[i].name] = this.features[i];
        }
        return returnedObj;
    }

    //Facilitates use of "for instance of ABT"
    [Symbol.iterator]() {
        let index = 0;
        let features = this.features;
        return {next: function():IteratorResult<Instance> {
            if (index < features[0].values.length) {
                return {
                    done: false,
                    value: new Instance(features.map(feature=>feature.values[index++]))
                }
            } else {
                return {
                    done: true,
                    value: new Instance([])
                }
            }
        }};
    }

    /**
     * The number of instances stored in this ABT. It is assumed that all features have the same length.
     */
    get length():number {
        if (unique(this.features.map(feature=>feature.values.length)).length != 1) {
            throw new Error('ABT cannot contain features of different length. If the value of a feature at some instance is not available, use `NaN` instead.');
        } else {
            return this.features[0].values.length;
        }
    }

    /**
     * Deletes any features whose name is not listed in `featureNames`. Returns the new ABT for chaining.
     */
    keepFeatures(featureNames:string[]):ABT {
        this.features.forEach(feature=>{
            if (!featureNames.includes(feature.name)) {
                this.removeFeature(feature.name);
            }
        })
        return this;
    }

    /**
     * Removes the feature with name `featureName` from the ABT. Returns the new ABT for chaining.
     */
    removeFeature(featureName:string):ABT {
        delete this.features[this.features.findIndex(feature=>feature.name==featureName)];
        return this;
    }

    /**
     * Duplicates the feature with name `featureName`
     */
    duplicateFeature(featureName:string, newFeatureName:string=featureName+'-copy', pushToEnd:boolean=false):ABT {
        let newFeature = deepCopy(this._features.featureName);
        newFeature.name = newFeatureName;
        if (pushToEnd) {
            this.features.push(newFeature);
        } else {
            this.features = this.features.slice(0, this.features.findIndex(feature=>feature.name == featureName)).concat(newFeature, ...this.features.slice(this.features.findIndex(feature=>feature.name == featureName)));
            //check if this is correct!
        }
        return this;
    }

    getInstance(index:number):Instance {
        return new Instance(this.features.map(feature=>feature.values[index]), this.features.map(feature=>feature.normalization));
    }

    /**
     * Pushes instance onto this ABT. Forces the instance to take on the same normalization as the ABT. Throws an error if the instance is incompatible with this ABT.
     * 
     */
    pushInstance(instance:Instance):ABT {
        if (instance.values.length != this.features.length) {
            throw new Error('Instance incompatible with ABT - the number of values in the instance must match the number of features in the ABT.');
        } else {
            //push instance, making sure normalizations match
            for (let index in instance.values) {
                instance.normalize(this.features.map(feature=>feature.normalization));
                this.features[index].push(instance.values[index]);
            }
        }
        return this;
    }

    /**
     * Removes any instances that violate the given `condition`. Returns the ABT for chaining.
     */
    keepInstances(condition:(instance:Instance)=>boolean):ABT {
        let newABT = deepCopy(this);
        newABT.features.forEach(feature=>feature.values = []);
        for (let index of range(this.length)) {
            let thisInstance = this.getInstance(index);
            if (condition(thisInstance)) {
                newABT.pushInstance(thisInstance);
            }
        }
        this.features = newABT.features;
        return this;
    }

    /**
     * Removes any instances which contain `NaN`.
     */
    removeNaNs():ABT {
        return this.keepInstances(instance=>!instance.values.includes(NaN));
    }

}

/**
 * An ABT with additional behavior that makes it convenient for use in quantitative finance.
 */
export class FinancialABT extends ABT {
    constructor() {
        super();
    }
}