import { NearestNeighbors } from '../../src/nearestNeighbors';
import { ABT } from '../../src/abt';

//Get data
let myABT = new ABT().fromFile('./../datasets/UVXY.csv');
console.log(myABT._features.AdjClose.values);