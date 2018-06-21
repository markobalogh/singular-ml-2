"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
class LearningAlgorithm {
    holdOutCV(dataset, testSplit = 0.3, randomize = true, parallel = false) {
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
        return {
            testSet: testSet,
            predictions: this.learnFrom(trainingSet).test(testSet)
        };
    }
}
exports.LearningAlgorithm = LearningAlgorithm;
//# sourceMappingURL=learningAlgorithm.js.map