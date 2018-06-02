"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
class LearningAlgorithm {
    holdOutCV(dataSet, testSplit = 0.3, randomizeTestSet = true, parallel = false) {
        //slice dataset into a test set and training set.
        let indices = utilities_1.range(dataSet.length);
        if (randomizeTestSet) {
            indices = utilities_1.shuffle(indices);
        }
        let testSetSize = Math.ceil(testSplit * indices.length);
        //slice dataset into a test set and training set.
        //then call learnFrom(trainingSet)
        //then call test() on the output.
        //NOTE: ASK THE ABT TO FIND INDICES FOR TRAINING AND TESTING! IT KNOWS ABOUT THE INFO CONTAMINATION.
    }
}
exports.LearningAlgorithm = LearningAlgorithm;
//# sourceMappingURL=learningAlgorithm.js.map