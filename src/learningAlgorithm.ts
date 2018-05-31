import { ABT } from ".";
import { Model } from './model';

export abstract class LearningAlgorithm {
    //learning algorithms are algorithms for going from a set of instances (the training set) to a Model.
    //It's tricky to figure out what the relationship between models & learning algorithms are for template based models...
    //Nearest neighbors may be best thought of as a learning algorithm whose objective is an aggregate of the scores of the models it outputs as it iterates through a cross-validation meta-dataset. Really what we want to score is the performance of nearest neighbors, as a function of the parameters of the nearest neighbors models, as we iterate over (trainingSet, testSet) pairs provided by a cross validation routine.
    //So, should learningAlgorithms be required to act as a mapping from a dataset to a model?
    //This would help clarify model scoring vs learning algorithm scoring (in which learning algorithm scoring would involve aggregating model scoring). Cross validation 

    abstract learnFrom(trainingSet:ABT):Model;

    holdOutCV(dataSet:ABT, testSplit:number=0.3, ):number {
        //slice dataset into a test set and training set.
        //then call learnFrom(trainingSet)
        //then call test() on the output.
    }
}