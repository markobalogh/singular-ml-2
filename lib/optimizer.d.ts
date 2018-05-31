import { Parameter } from './parameter';
export declare abstract class Optimizer {
    abstract optimizable: Optimizable;
    timeLimit: number;
    evalLimit: number;
    /**
     * An array of functions through which the optimizer instance is passed (in order) before the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return.
     */
    private inputPipeline;
    /**
     * A list of functions through which the optimizer instance is passed (in order) after the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return.
     */
    private outputPipeline;
    /**
     * This property stores the array of values that optimizable.parameters will be set to immediately before the objective function is called.
     */
    private objectiveInput;
    /**
     * This property stores the value of the objective function immediately after it returns.
     */
    private objectiveOutput;
    withTimeLimit(timeLimit: number): this;
    withEvalLimit(evalLimit: number): this;
    withFreeParameters(freeParameters: Parameter[]): this;
    private abstract;
    abstract maximize(): this;
    minimize(): this;
}
export declare class GridSearch extends Optimizer {
    constructor(optimizable: Optimizable);
}
export declare class RandomSearch extends Optimizer {
    constructor(optimizable: Optimizable);
    maximize(): this;
}
export interface HasObjective {
    objective: () => number;
}
export interface Parametrized {
    parameters: Parameter[];
}
export interface Optimizable extends Parametrized, HasObjective {
}
