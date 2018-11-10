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
    constructor(featureNames, instances) {
        super();
        this.instances = [];
        this.featureNames = [];
    }
    query(input) {
        return this.instances[input];
    }
    fromCSVString(csvString) {
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
        this.featureNames = headers;
        //Detect any weird ending to the file...sometimes the last row is just an endline character and that messes things up
        if (content[content.length - 1].length !== content[content.length - 2].length) {
            //Chop off the last row if so.
            content.pop();
        }
        //now, make sure each row has the same number of cells.
        console.assert((new Set(content.map((value) => { return value.length; }))).size == 1, 'Unable to create ABT from CSV file: inconsistent number of columns across rows.');
        //load data into ABT.
        this.instances = content.map(instance => instance.map(value => Number(value)));
        return this;
    }
    exportAsCSV(filename = 'untitled.csv') {
        let writestring = `${this.featureNames.join(', ')}\n`;
        for (let instance of this.instances) {
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
        for (let i = 0; i < this.featureNames.length; i++) {
            if (featureNames.includes(this.featureNames[i])) {
                keepIndices.push(i);
            }
        }
        this.featureNames = this.featureNames.filter((name, index) => keepIndices.includes(index));
        for (let instance of this.instances) {
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
        let featureIndex = this.featureNames.findIndex(name => name == featureName);
        if (featureIndex == -1) {
            throw new Error(`Feature ${featureName} not found among features ${this.featureNames.join(', ')}.`);
        }
        else {
            this.instances = this.instances.map(instance => instance.filter((value, index) => {
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
            this.featureNames.unshift(newFeatureName);
            for (let instance of this.instances) {
                instance.unshift(instance[0]);
            }
        }
        else {
            this.featureNames = [...this.featureNames.slice(0, this.featureNames.indexOf(featureName) + 1), newFeatureName, ...this.featureNames.slice(this.featureNames.indexOf(featureName) + 1)];
            let indexA = this.featureNames.indexOf(featureName) + 1;
            for (let instance of this.instances) {
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
    }
}
exports.ABT = ABT;
//# sourceMappingURL=abt.js.map