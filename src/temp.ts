import { FinancialABT, NearestNeighbors } from './index';
import { NearestNeighborsModel } from './nearestNeighbors';
import { CrossValidatedMAE, MAE } from './scoringFunction';

let x = new FinancialABT().fromFile('./../data/derived/stfReturn/daily/finalABT.csv');
x.keepFeatures('STF_ActualReturnPerDay');
x.generateRecursiveFeatures('STF_ActualReturnPerDay', 20);
x.removeNaNs();
x.exportAsCSV('unwrappedRecursiveFeatures.csv');
console.log(x);

let y = new NearestNeighbors();
let testResults = y.holdOutCV(x, 0.3, true, false);
console.log(testResults.scoreWith(MAE));