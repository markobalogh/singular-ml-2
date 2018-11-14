import * as utilities from './utilities';
import {Feature} from './feature';
import * as filesystem from 'fs';
import { flatCopy, unique, range } from './utilities';
import { Instance } from './instance';
import { Model } from './model';

export class ABT extends Model<number, number[]> {
    /**
     * Creates a new ABT. Data can be provided directly to the constructor or supplied using I/O methods like .from****()
     */
    constructor(public descriptiveFeatureNames:string[]=[], public targetFeatureNames:string[]=[], public descriptiveInstances:number[][]=[], public targetInstances:number[][]=[]) {
        super();
    }

    /**
     * Returns the descriptive instance at index `input`.
     */
    query(input:number):number[] {
        return this.descriptiveInstances[input];
    }

    /**
     * If `targetFeatureNames` is provided, columns with headers in `targetFeatureNames` will be treated as target features. If not, the last column will be assumed to be the target feature.
     */
    fromCSVString(csvString:string, targetFeatureNames?:string[]) {
        let rowArray = csvString.split('\n');
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
        if (targetFeatureNames) {
            this.targetFeatureNames = targetFeatureNames;
        }
        // this.featureNames = headers;
        //Detect any weird ending to the file...sometimes the last row is just an endline character and that messes things up
        if (content[content.length-1].length !== content[content.length-2].length) {
            //Chop off the last row if so.
            content.pop();
        }
        //now, make sure each row has the same number of cells.
        console.assert((new Set(content.map((value)=>{return value.length}))).size == 1, 'Unable to create ABT from CSV file: inconsistent number of columns across rows.');
        //load data into ABT.
        this.descriptiveInstances = new Array<number[]>(content.length);
        this.targetInstances = new Array<number[]>(content.length);
        //if headers are present, use those to figure out which values are descriptive and which are targets
        if (headers.length != 0) {
            //if target feature names were specified, we know exactly which features should be treated as targets.
            if (targetFeatureNames) {
                //

            } else {
                //if target feature names were not specified, assume the last feature is the target feature.
                targetFeatureNames = [headers[headers.length-1]];
            }
            this.targetFeatureNames = targetFeatureNames;
            this.descriptiveFeatureNames = headers.filter(header=>!this.targetFeatureNames.includes(header));
            for (let i in content) {
                let targetInstance:number[] = [];
                let descriptiveInstance:number[] = [];
                for (let k in content[i]) {
                    if (targetFeatureNames.includes((headers[k]))) {
                        targetInstance.push(Number(content[i][k]));
                    } else {
                        descriptiveInstance.push(Number(content[i][k]));
                    }
                }
                this.descriptiveInstances[i] = descriptiveInstance;
                this.targetInstances[i] = targetInstance;
            }
        } else {
            //no header information. Assume last feature is target feature
            for (let i in content) {
                this.targetInstances[i] = [Number(content[i][content[i].length-1])];
                this.descriptiveInstances[i] = content[i].slice(0, content[i].length-1).map(val=>Number(val));
            }
        }
        return this;
    }

    exportAsCSV(filename:string='untitled.csv') {
        let writestring = `${this.descriptiveFeatureNames.join(', ')}\n`
        for (let instance of this.descriptiveInstances) {
            writestring += instance.map(num=>String(num)).join(', ') + '\n';
        }
        filesystem.writeFileSync(filename, writestring);
        return this;
    }

    /**
     * Deletes any features whose name is not listed in the arguments. Returns the new ABT for chaining.
     */
    keepFeatures(...featureNames:string[]) {
        let keepIndices:number[] = [];
        for (let i=0;i<this.descriptiveFeatureNames.length;i++) {
            if (featureNames.includes(this.descriptiveFeatureNames[i])) {
                keepIndices.push(i);
            }
        } 
        this.descriptiveFeatureNames = this.descriptiveFeatureNames.filter((name,index)=>keepIndices.includes(index))
        for (let instance of this.descriptiveInstances) {
            let newInstance = [];
            for (let index of keepIndices) {
                newInstance.push(instance[index]);
            }
            instance = newInstance;
        }
        return this;
    }

    /**
     * Removes the feature with name `featureName` from the ABT. Returns the new ABT for chaining.
     */
    removeFeature(featureName:string) {
        let featureIndex = this.descriptiveFeatureNames.findIndex(name=>name == featureName);
        if (featureIndex == -1) {
            throw new Error(`Feature ${featureName} not found among features ${this.descriptiveFeatureNames.join(', ')}.`);
        } else {
            this.descriptiveInstances = this.descriptiveInstances.map(instance=>instance.filter((value,index)=>{
                return index != featureIndex;
            }));
        }
        return this;
    }

    /**
     * Duplicates the feature with name `featureName` and places inserts it at the front of the ABT unless `pushToFront` is false, wherein the new feature is inserted in front of the duplicated feature.
     */
    duplicateFeature(featureName:string, newFeatureName:string=featureName+'-copy', pushToFront:boolean=true) {
        if (pushToFront) {
            this.descriptiveFeatureNames.unshift(newFeatureName);
            for (let instance of this.descriptiveInstances) {
                instance.unshift(instance[0]);
            }
        } else {
            this.descriptiveFeatureNames = [...this.descriptiveFeatureNames.slice(0, this.descriptiveFeatureNames.indexOf(featureName)+1), newFeatureName, ...this.descriptiveFeatureNames.slice(this.descriptiveFeatureNames.indexOf(featureName)+1)];
            let indexA = this.descriptiveFeatureNames.indexOf(featureName)+1;
            for (let instance of this.descriptiveInstances) {
                instance = [...instance.slice(0, indexA), instance[indexA-1], ...instance.slice(indexA)];
            }
        }
        return this;
    }

    fromFile(filename:string) {
        if (filename.endsWith('.abt') || filename.endsWith('.json')) {
            Object.assign(this, JSON.parse(filesystem.readFileSync(filename).toString()));
            return this;
        } else if (filename.endsWith('.csv') || filename.endsWith('.txt')) {
            let filecontent = filesystem.readFileSync(filename).toString();
            return this.fromCSVString(filecontent);
        } else {
            throw new Error('An ABT can be constructed from .abt, .json, .csv, and .txt files only.')
        }
    }
}