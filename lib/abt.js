"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem = __importStar(require("fs"));
const model_1 = require("./model");
class ABT extends model_1.Model {
    /**
     * Creates a new ABT. Data can be provided directly to the constructor or supplied using I/O methods like .from****()
     */
    constructor(descriptiveFeatureNames = [], targetFeatureNames = [], descriptiveInstances = [], targetInstances = []) {
        super();
        this.descriptiveFeatureNames = descriptiveFeatureNames;
        this.targetFeatureNames = targetFeatureNames;
        this.descriptiveInstances = descriptiveInstances;
        this.targetInstances = targetInstances;
    }
    /**
     * Returns the descriptive instance at index `input`.
     */
    query(input) {
        return this.descriptiveInstances[input];
    }
    /**
     * If `targetFeatureNames` is provided, columns with headers in `targetFeatureNames` will be treated as target features. If not, the last column will be assumed to be the target feature.
     */
    fromCSVString(csvString, targetFeatureNames) {
        let rowArray = csvString.split('\n');
        //try to detect headers
        if (rowArray[0].length !== rowArray[1].length) {
            //first row is header row
            var headers = rowArray[0].split(',');
            var content = rowArray.slice(1).map((value) => {
                return value.split(',');
            });
        }
        else {
            var headers = [];
            var content = rowArray.map((value) => {
                return value.split(',');
            });
        }
        if (targetFeatureNames) {
            this.targetFeatureNames = targetFeatureNames;
        }
        // this.featureNames = headers;
        //Detect any weird ending to the file...sometimes the last row is just an endline character and that messes things up
        if (content[content.length - 1].length !== content[content.length - 2].length) {
            //Chop off the last row if so.
            content.pop();
        }
        //now, make sure each row has the same number of cells.
        console.assert((new Set(content.map((value) => { return value.length; }))).size == 1, 'Unable to create ABT from CSV file: inconsistent number of columns across rows.');
        //load data into ABT.
        this.descriptiveInstances = new Array(content.length);
        this.targetInstances = new Array(content.length);
        //if headers are present, use those to figure out which values are descriptive and which are targets
        if (headers.length != 0) {
            //if target feature names were specified, we know exactly which features should be treated as targets.
            if (targetFeatureNames) {
                //
            }
            else {
                //if target feature names were not specified, assume the last feature is the target feature.
                targetFeatureNames = [headers[headers.length - 1]];
            }
            this.targetFeatureNames = targetFeatureNames;
            this.descriptiveFeatureNames = headers.filter(header => !this.targetFeatureNames.includes(header));
            for (let i in content) {
                let targetInstance = [];
                let descriptiveInstance = [];
                for (let k in content[i]) {
                    if (targetFeatureNames.includes((headers[k]))) {
                        targetInstance.push(Number(content[i][k]));
                    }
                    else {
                        descriptiveInstance.push(Number(content[i][k]));
                    }
                }
                this.descriptiveInstances[i] = descriptiveInstance;
                this.targetInstances[i] = targetInstance;
            }
        }
        else {
            //no header information. Assume last feature is target feature
            for (let i in content) {
                this.targetInstances[i] = [Number(content[i][content[i].length - 1])];
                this.descriptiveInstances[i] = content[i].slice(0, content[i].length - 1).map(val => Number(val));
            }
        }
        return this;
    }
    exportAsCSV(filename = 'untitled.csv') {
        let writestring = `${this.descriptiveFeatureNames.join(', ')}\n`;
        for (let instance of this.descriptiveInstances) {
            writestring += instance.map(num => String(num)).join(', ') + '\n';
        }
        filesystem.writeFileSync(filename, writestring);
        return this;
    }
    /**
     * Deletes any features whose name is not listed in the arguments. Returns the new ABT for chaining.
     */
    keepFeatures(...featureNames) {
        let keepIndices = [];
        for (let i = 0; i < this.descriptiveFeatureNames.length; i++) {
            if (featureNames.includes(this.descriptiveFeatureNames[i])) {
                keepIndices.push(i);
            }
        }
        this.descriptiveFeatureNames = this.descriptiveFeatureNames.filter((name, index) => keepIndices.includes(index));
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
    removeFeature(featureName) {
        let featureIndex = this.descriptiveFeatureNames.findIndex(name => name == featureName);
        if (featureIndex == -1) {
            throw new Error(`Feature ${featureName} not found among features ${this.descriptiveFeatureNames.join(', ')}.`);
        }
        else {
            this.descriptiveInstances = this.descriptiveInstances.map(instance => instance.filter((value, index) => {
                return index != featureIndex;
            }));
        }
        return this;
    }
    /**
     * Duplicates the feature with name `featureName` and places inserts it at the front of the ABT unless `pushToFront` is false, wherein the new feature is inserted in front of the duplicated feature.
     */
    duplicateFeature(featureName, newFeatureName = featureName + '-copy', pushToFront = true) {
        if (pushToFront) {
            this.descriptiveFeatureNames.unshift(newFeatureName);
            for (let instance of this.descriptiveInstances) {
                instance.unshift(instance[0]);
            }
        }
        else {
            this.descriptiveFeatureNames = [...this.descriptiveFeatureNames.slice(0, this.descriptiveFeatureNames.indexOf(featureName) + 1), newFeatureName, ...this.descriptiveFeatureNames.slice(this.descriptiveFeatureNames.indexOf(featureName) + 1)];
            let indexA = this.descriptiveFeatureNames.indexOf(featureName) + 1;
            for (let instance of this.descriptiveInstances) {
                instance = [...instance.slice(0, indexA), instance[indexA - 1], ...instance.slice(indexA)];
            }
        }
        return this;
    }
    fromFile(filename) {
        if (filename.endsWith('.abt') || filename.endsWith('.json')) {
            Object.assign(this, JSON.parse(filesystem.readFileSync(filename).toString()));
            return this;
        }
        else if (filename.endsWith('.csv') || filename.endsWith('.txt')) {
            let filecontent = filesystem.readFileSync(filename).toString();
            return this.fromCSVString(filecontent);
        }
        else {
            throw new Error('An ABT can be constructed from .abt, .json, .csv, and .txt files only.');
        }
    }
    /**
     * Returns a new ABT representing only the instances at the given indices.
     */
    subset(indices) {
        let newABT = Object.assign(new ABT(), this);
        newABT.descriptiveInstances = newABT.descriptiveInstances.filter((value, index) => {
            return indices.includes(index);
        });
        newABT.targetInstances = newABT.targetInstances.filter((value, index) => {
            return indices.includes(index);
        });
        return newABT;
    }
}
exports.ABT = ABT;
//# sourceMappingURL=abt.js.map