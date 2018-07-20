import { ABT } from ".";
import { Model } from './model';
import { Optimizable } from "./optimizer";
import { Parameter } from "./parameter";
import { range, shuffle } from "./utilities";
import { Instance } from "./instance";
import { Prediction } from "./prediction";
import { CrossValidatedMAE, ScoringFunction } from './scoringFunction';

export abstract class LearningAlgorithm {
    //learning algorithms are algorithms for going from a set of instances (the training set) to a Model.
    //It's tricky to figure out what the relationship between models & learning algorithms is for template based models...
    //Nearest neighbors may be best thought of as a learning algorithm whose objective is an aggregate of the scores of the models it outputs as it iterates through a cross-validation meta-dataset. Really what we want to score is the performance of nearest neighbors, as a function of the parameters of the nearest neighbors models, as we iterate over (trainingSet, testSet) pairs provided by a cross validation routine.
    //So, should learningAlgorithms be required to act as a mapping from a dataset to a model?
    //This would help clarify model scoring vs learning algorithm scoring (in which learning algorithm scoring would involve aggregating model scoring). Cross validation 

    abstract learnFrom(trainingSet:Instance[]):Model;

    abstract parameters:Parameter[];



    holdOutTest(dataset:ABT, testSplit:number=0.3, randomize:boolean=true, parallel:boolean=false):TestResults {
        //slice dataset into a test set and training set.
        let indices = range(dataset.length);
        if (randomize) {
            indices = shuffle(indices);
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

/**
 * The TestResults class represents the predictions made by a model and the test set those predictions are to be compared to.
 */
export class TestResults {
    constructor(public testSet:Instance[], public predictions:Prediction[]) {

    }

    scoreWith(scoringFunction:ScoringFunction):number {
        return scoringFunction(this);
    }
}