import { euclideanDistanceMetric } from './distanceMetric';
import { Instance } from './instance';

let y = new Instance([1,2,3,4]);
let x = euclideanDistanceMetric.evaluate(y, y);