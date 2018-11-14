"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const utilities_1 = require("./utilities");
//A cross validator is a model mapping a learning algorithm and an ABT to a cross validated score
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
        let indices = utilities_1.range(input.dataset.instances.length);
        if (this.randomize) {
            indices = utilities_1.shuffle(indices);
        }
        let testSetSize = Math.ceil(this.testSplit * indices.length);
        let testSet = (indices.slice(0, testSetSize)).map(index => input.dataset.query(index));
        let trainingSet = indices.slice(testSetSize + Math.abs(this.informationContaminationOffset), indices.length).map(index => input.dataset.query(index));
        let model = input.learningAlgorithm.query(input.dataset.instances);
        let returnArray = [];
        for (let i = 0; i < testSet.length; i++) {
            let modelOutput = model.query(testSet[i]);
            //model output will contain one prediction/confidence pair per target feature.
            returnArray[i] = model.query(testSet[i]).map(obj => { return Object.assign({}, obj, { target:  }); });
        }
        return new TestResults(testSet, this.learnFrom(trainingSet).test(testSet));
    }
}
exports.HoldOutCrossValidator = HoldOutCrossValidator;
class KFoldCrossValidator extends CrossValidator {
    /**
     * K is the number of folds.
     */
    constructor(k) {
        super();
    }
}
exports.KFoldCrossValidator = KFoldCrossValidator;
class LeaveOneOutCrossValidator extends CrossValidator {
    query(input) {
    }
}
exports.LeaveOneOutCrossValidator = LeaveOneOutCrossValidator;
//# sourceMappingURL=crossValidator.js.map