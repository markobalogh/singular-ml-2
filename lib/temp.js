"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let x = new index_1.FinancialABT().fromFile('./../data/derived/stfReturn/daily/finalABT.csv');
x.keepFeatures('STF_ActualReturnPerDay');
x.generateRecursiveFeatures('STF_ActualReturnPerDay', 20);
x.removeNaNs();
x.exportAsCSV('unwrappedRecursiveFeatures.csv');
console.log(x);
let y = new index_1.NearestNeighbors;
//# sourceMappingURL=temp.js.map