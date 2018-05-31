import { Parameter } from './parameter';
export interface HasObjective {
    objective: () => number;
}
export interface Parametrized {
    parameters: Parameter[];
}
/**
 * Represents an optimizable object - such an object is required to have an `objective` function retuning a number that represents its performance, a `parameters` list capturing the domain of the objective function.
 */
export interface Optimizable extends Parametrized, HasObjective {
}
export interface GradientDescentOptimizable extends Optimizable {
}
export declare abstract class Optimizer {
    abstract optimizable: Optimizable;
    /**
     * The number of threads *used at the level of the logic of the Optimizer*. This means that `this.optimizable.objective()` will be called `numberOfThreads` times in parallel. It is possible that `this.optimizable.objective()` incorporates parallelism `within it`, in which case `numberOfThreads` should be set with that in mind.
     *
     * The default behavior is that `numberOfThreads` is equal to `os.cpus().length`, the number of virtual cores on the host.
     */
    numberOfThreads: number;
    /**
     * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `timeLimit` seconds.
     */
    timeLimit: number;
    /**
     * Stores a timestamp of when `this.maximize()` or `this.minimize()` was called last.
     */
    protected startTime: number;
    /**
     * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `evalLimit` evaluations of the objective function.
     */
    evalLimit: number;
    /**
     * An array of functions through which the optimizer instance is passed (in order) before the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return. By convention, it is the input pipeline's responsibility to determine appropriate values for `this.objectiveInput` during each iteration of the loop in `this.maximize()`. Of course the input pipeline has at its disposal the results of any previous objective calls in `thisObj`.
     */
    protected evalCount: number;
    protected inputPipeline: ((thisObj: this) => void)[];
    /**
     * A list of functions through which the optimizer instance is passed (in order) after the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return.
     */
    protected outputPipeline: ((thisObj: this) => void)[];
    /**
     * Each element of this array is an input vector that optimizable.parameters will be set to immediately before the objective function is called. There are multiple such input vectors in the case that `this.numberOfThreads` is greater than one. This array is passed through `this.optimizable.objective()`, parallelized over `this.numberOfThreads`.
     */
    protected objectiveInput: number[][];
    /**
     * This property stores the value of the objective function immediately after it returns. This array holds one value per thread in `this.numberOfThreads`. If the objective function has not been called since the creation of `this`, the value of `objectiveOutput` is `Array(this.numberOfThreads).fill(NaN)`.
     */
    protected objectiveOutput: number[];
    /**
     * This method must be implemented by all subclasses of `Optimizer` and called in the constructor. In it, the subclass should populate `this.inputPipeline` with at least one function so that there is some *logic* to the optimizer (the optimizer cannot just loop infinitely doing nothing).
     */
    protected abstract initializeOptimizationLogic(): void;
    withTimeLimit(timeLimit: number): this;
    withEvalLimit(evalLimit: number): this;
    withFreeParameters(freeParameters: Parameter[]): this;
    maximize(): this;
    minimize(): this;
}
export declare class RandomSearch extends Optimizer {
    optimizable: Optimizable;
    numberOfThreads: number;
    constructor(optimizable: Optimizable, numberOfThreads?: number);
    initializeOptimizationLogic(): void;
}
