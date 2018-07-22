"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const scoringFunction_1 = require("./scoringFunction");
let x = new index_1.FinancialABT().fromFile('./../data/derived/stfReturn/daily/finalABT.csv');
x.keepFeatures('STF_ActualReturnPerDay');
x.generateRecursiveFeatures('STF_ActualReturnPerDay', 20);
x.removeNaNs();
x.features[0].isTarget = true;
x.exportAsCSV('unwrappedRecursiveFeatures.csv');
console.log(x);
let y = new index_1.NearestNeighbors().withK(10).withSigma(1).withExponent(2).holdOutTest(x, 0.3, true, false).scoreWith(scoringFunction_1.MAE);
console.log(y);
// let testResults = y.holdOutCV(x, 0.3, true, false);
// console.log(testResults.scoreWith(MAE));
//# sourceMappingURL=temp.js.map