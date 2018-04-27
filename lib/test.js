"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const distanceMetric_1 = require("./distanceMetric");
const instance_1 = require("./instance");
let y = new instance_1.Instance([1, 2, 3, 4]);
let x = distanceMetric_1.euclideanDistanceMetric.evaluate(y, y);
//# sourceMappingURL=test.js.map