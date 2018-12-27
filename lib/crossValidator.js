"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const utilities_1 = require("./utilities");
class CrossValidator extends model_1.Model {
}
exports.CrossValidator = CrossValidator;
class HoldOutCrossValidator extends CrossValidator {
    /**
     * `testSplit` is the proportion of the incoming ABT that will be held out as the test set.
     * `randomize` determines whether the test set contains instances randomly sampled from the ABT (default). Otherwise the test set consists of a contiguous slice of the ABT.
     */
    constructor(testSplit = 0.3, randomize = true, informationContaminationOffset = 0) {
        super();
        this.testSplit = testSplit;
        this.randomize = randomize;
        this.informationContaminationOffset = informationContaminationOffset;
    }
    query(input) {
        //slice dataset into a test set and training set.
        let indices = utilities_1.range(input.dataset.descriptiveInstances.length);
        if (this.randomize) {
            indices = utilities_1.shuffle(indices);
        }
        let testSetSize = Math.ceil(this.testSplit * indices.length);
        let testSet = (indices.slice(0, testSetSize));
        let trainingSet = indices.slice(testSetSize + Math.abs(this.informationContaminationOffset), indices.length);
        let model = input.learningAlgorithm.query(input.dataset.subset(trainingSet));
        let returnArray = [];
        for (let i = 0; i < testSet.length; i++) {
            let modelOutput = model.query(input.dataset.descriptiveInstances[testSet[i]]);
            //model output will contain one prediction/confidence pair per target feature.
            returnArray.push(...modelOutput.map((obj, index) => { return Object.assign({}, obj, { target: input.dataset.targetInstances[testSet[i]][index] }); }));
        }
        return returnArray;
    }
}
exports.HoldOutCrossValidator = HoldOutCrossValidator;
// export class KFoldCrossValidator<inputType,outputType> extends CrossValidator<inputType,outputType> {
//     /**
//      * K is the number of folds.
//      */
//     constructor(k:number) {
//         super();
//     }
// }
// export class LeaveOneOutCrossValidator<inputType,outputType> extends CrossValidator<inputType,outputType> {
//     query(input:[LearningAlgorithm<inputType,outputType>, ABT]):Model<inputType,outputType> {
//     }
// }
//# sourceMappingURL=crossValidator.js.map