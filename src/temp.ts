import { FinancialABT, NearestNeighbors } from './index';
import { NearestNeighborsModel } from './nearestNeighbors';
import { CrossValidatedMAE, MAE } from './scoringFunction';

let x = new FinancialABT().fromFile('./../data/derived/stfReturn/daily/finalABT.csv');
x.keepFeatures('STF_ActualReturnPerDay');
x.generateRecursiveFeatures('STF_ActualReturnPerDay', 20);
x.removeNaNs();
x.features[0].isTarget = true;
x.exportAsCSV('unwrappedRecursiveFeatures.csv');
console.log(x);

let y = new NearestNeighbors().withK(10).withSigma(1).withExponent(2).holdOutTest(x, 0.3, true, false).scoreWith(MAE);
console.log(y);
// let testResults = y.holdOutCV(x, 0.3, true, false);
// console.log(testResults.scoreWith(MAE));