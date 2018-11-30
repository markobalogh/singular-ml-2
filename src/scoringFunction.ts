import { Prediction } from './prediction';
import { Instance } from './instance';
import { mean } from './utilities';
import { Model } from './model';

export type TestResult = {
    prediction:number,
    target:number,
    confidence:number
}; //should this be testResult or testResults?

export abstract class ScoringFunction extends Model<TestResult[], number> {
    abstract query(input:TestResult[]):number;
}

export class MAE extends ScoringFunction {
    constructor() {
        super();
    }
    query(input:TestResult[]):number {
        let returnArray = new Array<number>(input.length);
        for (let i=0;i<input.length;i++) {
            returnArray[i] = Math.abs(input[i].prediction - input[i].target);
        }
        if ((<any>input[0]).confidence) {
            try {
                return mean(returnArray, <any>input.map(obj=>obj.confidence));
            } catch (err) {
                throw new Error('If confidences are set for any predictions, they must be set for all predictions.');
            }
        } else {
            return mean(returnArray);
        }
    }
}

export class RMSE extends ScoringFunction {
    constructor() {
        super();
    }
    query(input:TestResult[]):number {
        let returnArray = new Array<number>(input.length);
        for (let i=0;i<input.length;i++) {
            returnArray[i] = Math.pow((input[i].prediction - input[i].target),2);
        }
        if ((<any>input[0]).confidence) {
            try {
                return Math.sqrt(mean(returnArray, <any>input.map(obj=>obj.confidence)));
            } catch (err) {
                throw new Error('If confidences are set for any predictions, they must be set for all predictions.');
            }
        } else {
            return Math.sqrt(mean(returnArray));
        }
    }
}

// export var CrossValidatedMAE:CrossValidationScoringFunction = function(tests:{testSet:Instance[],predictions:Prediction[]}[]):number {
//     return mean(tests.map(testObj=>{
//         return MAE(new TestResults(testObj.testSet, testObj.predictions));
//     }));
// }

// export var CrossValidatedRMSE:CrossValidationScoringFunction = function(tests) {
//     return RMSE(new TestResults(Array.prototype.concat(tests.map(testObj=>testObj.testSet)), Array.prototype.concat(tests.map(testObj=>testObj.predictions))));
// }

//NOTE: we should redesign how scoring functions and cross validation scoring functions work - in reality, we have scoring functions that map testResults to numbers and then we have a few different ways to aggregate those numbers when cross validation (i.e., multiple tests) needs to be scored.