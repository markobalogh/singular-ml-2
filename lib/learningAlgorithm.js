"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const utilities_1 = require("./utilities");
class LearningAlgorithm extends model_1.Model {
}
exports.LearningAlgorithm = LearningAlgorithm;
class LearningAlgorithm2 {
    holdOutTest(dataset, testSplit = 0.3, randomize = true, parallel = false) {
        //slice dataset into a test set and training set.
        let indices = utilities_1.range(dataset.length);
        if (randomize) {
            indices = utilities_1.shuffle(indices);
            if (dataset.informationContaminationOffset != 0) {
                console.log(`WARNING: Partitioning the dataset into a training set and test set cannot be done safely when the dataset is randomized and has a non-zero information contamination offset.`);
            }
        }
        let testSetSize = Math.ceil(testSplit * indices.length);
        let trainingSetSize = dataset.length - testSetSize - Math.abs(dataset.informationContaminationOffset);
        let testSet = dataset.getInstances(indices.slice(0, testSetSize));
        let trainingSet = dataset.getInstances(indices.slice(testSetSize + Math.abs(dataset.informationContaminationOffset), indices.length));
        return new TestResults(testSet, this.learnFrom(trainingSet).test(testSet));
    }
}
exports.LearningAlgorithm2 = LearningAlgorithm2;
/**
 * The TestResults class represents the predictions made by a model and the test set those predictions are to be compared to.
 */
class TestResults {
    constructor(testSet, predictions) {
        this.testSet = testSet;
        this.predictions = predictions;
    }
    scoreWith(scoringFunction) {
        return scoringFunction(this);
    }
}
exports.TestResults = TestResults;
//# sourceMappingURL=learningAlgorithm.js.map