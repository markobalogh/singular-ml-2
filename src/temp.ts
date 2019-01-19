import { ABT } from './abt';
import { NearestNeighbors } from './nearestNeighbors';
import { EuclideanDistanceMetric } from './distanceMetric';
// import { LeaveOneOutCrossValidator } from './crossValidator';
let dataset = new ABT().fromFile('data/derived/stfReturn/daily/finalABT.csv');
let algo = new NearestNeighbors().withDistanceMetric('euclidean').withDistanceWeighting('generalizedGaussian').withZeroDistanceHandling('continue').withExponent(2).withSigma(0.01);

// let model = new LeaveOneOutCrossValidator().query([algo, dataset])