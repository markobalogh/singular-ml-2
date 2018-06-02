import * as utilities from './utilities';
import {Feature} from './feature';
import * as filesystem from 'fs';
import { flatCopy, unique, range } from './utilities';
import { Instance } from './instance';

export class ABT {
    features:Feature[] = [];
    /**
     * Indicates how instances in the ABT are contaminated with information from other instances. If 0, there is no contamination. If 1, then instance n+1 is contaminated with information from instance n. If -1, then instance n-1 is contaminated with information from instance n. This offset is used to ensure that trainingSet/testSet partitions are information-safe.
     */
    informationContaminationOffset:number=0;

    /**
     * Creates a new ABT instance. To initialize the ABT with data you can call `new ABT().from*****()`.
     */
    constructor() {
        
    }

    static fromObj(obj:any):ABT {
        let newABT = new ABT();
        newABT = Object.assign(newABT, obj);
        newABT.features = obj.features.map((featureobj:any)=>Feature.fromObj(featureobj));
        return newABT;
    }

    /**
     * Returns a *new* ABT that is an exact copy of `this`.
     */
    copy():this {
        let newObj:this = Object.getPrototypeOf(this).constructor();
        newObj = Object.assign(newObj, this);
        newObj.features = this.features.map((featureobj:any)=>Feature.fromObj(featureobj));
        return newObj;
    }

    ///////////////////////////////// I/O //////////////////////////////////

    fromNestedArray(data:any[][]) {
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

    fromObjectOfArrays(data:{[index:string]:any[]}) {
        this.features = [];
        for (let featureName in data) {
            this.features.push(new Feature(featureName, data[featureName]));
        }
        return this;
    }

    fromArrayOfObjects(data:{[index:string]:any}[]) {
        this.features = [];
        for (let featureName in data[0]) {
            this.features.push(new Feature(featureName, data.map((value)=>{return value[featureName]})));
        }
        return this;
    }
    
    fromFile(filename:string) {
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

    save(filename:string='untitled.abt') {
        filesystem.writeFileSync(filename, JSON.stringify(this));
        return this;
    }

    exportAsCSV(filename:string='untitled.csv') {
        let writestring = this.features.map(feature=>feature.name).join(', ') + '\n';
        for (let instance of this.instances) {
            writestring += instance.values.join(', ') + '\n';
        }
        filesystem.writeFileSync(filename, writestring);
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

    featureByName(featureName:string):Feature {
        return this.features[this.features.findIndex(feature=>feature.name==featureName)];
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
    keepFeatures(...featureNames:string[]) {
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
    removeFeature(featureName:string) {
        this.features.splice(this.features.findIndex(feature=>feature.name==featureName), 1);
        return this;
    }

    /**
     * Duplicates the feature with name `featureName` and pushed the feature to the end of `ABT.features` unless `pushToEnd` is false.
     */
    duplicateFeature(featureName:string, newFeatureName:string=featureName+'-copy', pushToEnd:boolean=true) {
        let newFeature = Feature.fromObj(flatCopy(this._features[featureName]));
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
    pushInstance(instance:Instance) {
        if (instance.values.length != this.features.length) {
            throw new Error('Instance incompatible with ABT - the number of values in the instance must match the number of features in the ABT.');
        } else {
            //push instance, making sure normalizations match
            for (let i=0;i<instance.values.length;i++) {
                instance.normalize(this.features.map(feature=>feature.normalization));
                this.features[i].push(instance.values[i]);
            }
        }
        return this;
    }

    /**
     * Removes any instances that violate the given `condition`. Returns the ABT for chaining.
     */
    keepInstances(condition:(instance:Instance, index:number)=>boolean) {
        let newABT = ABT.fromObj(flatCopy(this));
        newABT.features.forEach(feature=>feature.values = []);
        for (let _index of range(this.length)) {
            let thisInstance = this.getInstance(_index);
            if (condition(thisInstance, _index)) {
                newABT.pushInstance(thisInstance);
            }
        }
        this.features = newABT.features;
        return this;
    }

    /**
     * Removes any instances which contain `NaN`.
     */
    removeNaNs() {
        return this.keepInstances(instance=>!instance.values.includes(NaN));
    }

    /**
     * Use this property only for debugging purposes or iterating through all instances. If you know which instance you need, call ABT.getInstance() because this property dynamically regenerates the entire array of instances for each call.
     */
    get instances():Instance[] {
        return range(this.length).map(value=>this.getInstance(value));
    }

    /**
     * Get multiple instances.
     */
    getInstances(indices:number[]):Instance[] {
        return indices.map(value=>this.getInstance(value));
    }

    /**
     * Returns a *new* copy of this ABT which contains only the instances at the given indices.
     */
    getSubset(indices:number[]):this {
        return <this>this.partition((instance,index)=>indices.includes(index)).get(true);
    }

    /**
     * Returns a consecutive subset of `this` from `startIndex` up to but not including `endIndex`. The default `startIndex` is 0 and the default `endIndex` is `this.length`.
     */
    getSlice(startIndex:number=0, endIndex:number=this.length):this {
        return <this>this.partition((instance, index)=>(index>=startIndex && index < endIndex)).get(true);
    }

    /**
     * Let's see if we can make this function return an object that is indexed by the values returned by `condition`. I think a plain JS object can't do it because indices have to be numbers or strings. Maybe a map?
     */
    partition<T>(condition:(instance:Instance,index:number)=>T):Map<T,this> {
        let returnMap = new Map<T,this>();
        for (let i of range(this.length)) {
            let conditionOutput = condition(this.getInstance(i), i);
            if (!returnMap.has(conditionOutput)) {
                //create a new ABT with all the same properties as this one but with no instances.
                returnMap.set(conditionOutput, this.copy().keepInstances(()=>false));
            } 
            //append this instance to that ABT.
            (<this>returnMap.get(conditionOutput)).pushInstance(this.getInstance(i));
        }
        return returnMap;
    }

    //Add a method here that can split the ABT into a training set and a test set. The method will return lists of indices - the ABT can make sure there's no information contamination in the way that the training and test set were split, and then whatever is calling this method can store the training and testing indices for its purposes.

}