import { ABT } from ".";
import { Model } from './model';
// import { Optimizable } from "./optimizer";
import { Parameter } from "./parameter";
import { range, shuffle } from "./utilities";
import { Instance } from "./instance";
import { Prediction } from "./prediction";

export abstract class LearningAlgorithm extends Model<ABT, Model<number[],{prediction:number,confidence:number}[]>> {
    
}