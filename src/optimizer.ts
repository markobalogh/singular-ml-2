import {Parameter} from './parameter';
import ParallelController = require('paralleljs');
import os = require('os');

export interface HasObjective {
    objective:()=>number;
}

export interface Parametrized {
    parameters:Parameter[];
}

/**
 * Represents an optimizable object - such an object is required to have an `objective` function retuning a number that represents its performance, a `parameters` list capturing the domain of the objective function.
 */
export interface Optimizable extends Parametrized, HasObjective {

}

export interface GradientDescentOptimizable extends Optimizable {

}

export abstract class Optimizer {
    //should include stuff that records which input values have been tested, and what the results were.
    abstract optimizable:Optimizable;
    /**
     * The number of threads *used at the level of the logic of the Optimizer*. This means that `this.optimizable.objective()` will be called `numberOfThreads` times in parallel. It is possible that `this.optimizable.objective()` incorporates parallelism `within it`, in which case `numberOfThreads` should be set with that in mind.
     * 
     * The default behavior is that `numberOfThreads` is equal to `os.cpus().length`, the number of virtual cores on the host.
     */
    public numberOfThreads:number=os.cpus().length;
    /**
     * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `timeLimit` seconds.
     */
    public timeLimit:number=Infinity;
    /**
     * Stores a timestamp of when `this.maximize()` or `this.minimize()` was called last.
     */
    protected startTime:number=NaN;
    /**
     * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `evalLimit` evaluations of the objective function.
     */
    public evalLimit:number=Infinity;
    /**
     * An array of functions through which the optimizer instance is passed (in order) before the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return. By convention, it is the input pipeline's responsibility to determine appropriate values for `this.objectiveInput` during each iteration of the loop in `this.maximize()`. Of course the input pipeline has at its disposal the results of any previous objective calls in `thisObj`.
     */
    protected evalCount:number=0;
    protected inputPipeline:((thisObj:this)=>void)[]=[
        function (thisObj) {
            if ((Date.now()-thisObj.startTime) > (1000 * thisObj.timeLimit)) {
                throw new Error('Optimizer time limit exceeded.');
            }
        },
        function (thisObj) {
            if (thisObj.evalCount > thisObj.evalLimit) {
                throw new Error('Optimizer objective evaluation limit exceeded.');
            }
        }
    ];
    /**
     * A list of functions through which the optimizer instance is passed (in order) after the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return.
     */
    protected outputPipeline:((thisObj:this)=>void)[]=[];
    /**
     * Each element of this array is an input vector that optimizable.parameters will be set to immediately before the objective function is called. There are multiple such input vectors in the case that `this.numberOfThreads` is greater than one. This array is passed through `this.optimizable.objective()`, parallelized over `this.numberOfThreads`.
     */
    protected objectiveInput:number[][] = Array(this.numberOfThreads).fill(Array(this.optimizable.parameters.length).fill(NaN));
    /**
     * This property stores the value of the objective function immediately after it returns. This array holds one value per thread in `this.numberOfThreads`. If the objective function has not been called since the creation of `this`, the value of `objectiveOutput` is `Array(this.numberOfThreads).fill(NaN)`.
     */
    protected objectiveOutput:number[] = Array(this.numberOfThreads).fill(NaN);

    /**
     * This method must be implemented by all subclasses of `Optimizer` and called in the constructor. In it, the subclass should populate `this.inputPipeline` with at least one function so that there is some *logic* to the optimizer (the optimizer cannot just loop infinitely doing nothing).
     */
    protected abstract initializeOptimizationLogic():void;

    withTimeLimit(timeLimit:number):this {
        this.timeLimit = timeLimit;
        return this
    }

    withEvalLimit(evalLimit:number):this {
        this.evalLimit = evalLimit;
        return this;
    }

    withFreeParameters(freeParameters:Parameter[]):this {
        for (let parameter of this.optimizable.parameters) {
            if (freeParameters.includes(parameter)) {
                parameter.fixed = false;
            } else {
                parameter.fixed = true;
            }
            parameter.fixed = false;
        }
        return this;
    }

    maximize():this {
        this.startTime = Date.now();
        //optimization loop
        while (true) {
            try {
                for (let n=0;n<this.inputPipeline.length;n++) {
                    this.inputPipeline[n](this);
                }
                let parallelController = new ParallelController(this.objectiveInput, {
                    maxWorkers: this.numberOfThreads
                });
                function helper(arg:{inputVector:number[], optimizable:Optimizable, outputPlaceholder:number}) {
                    for (let i=0;i<arg.optimizable.parameters.length;i++) {
                        arg.optimizable.parameters[i].value = arg.inputVector[i];
                    };
                    arg.outputPlaceholder = arg.optimizable.objective();
                    return arg;
                }
                this.evalCount += this.numberOfThreads;
                parallelController.map(helper).then((data)=>{
                    console.log(data);
                });
                for (let n=0;n<this.outputPipeline.length;n++) {
                    this.outputPipeline[n](this);
                }
            } catch (err) {
                console.log(err);
                return this;
            }
        }
    }

    minimize():this {
        this.outputPipeline.push((thisobj:this)=>{
            //minimization should occur naturally if we multiply the objective output by negative one.
            thisobj.objectiveOutput = this.objectiveOutput.map(value=>(value*-1));
        });
        return this.maximize();
    }

}

// export class GridSearch extends Optimizer {
//     constructor(optimizable:Optimizable) {
//         super();
//     }
// }

export class RandomSearch extends Optimizer {
    constructor(public optimizable:Optimizable, public numberOfThreads:number=os.cpus().length) {
        super();
        this.initializeOptimizationLogic();
    }

    initializeOptimizationLogic():void {
        this.inputPipeline.push((thisObj)=>{
            thisObj.objectiveInput = Array(thisObj.numberOfThreads).map(value=>{
                return thisObj.optimizable.parameters.map((parameter)=>{
                    return parameter.lowerBound + (Math.random() * (parameter.upperBound - parameter.lowerBound));
                })
            });
        });
    }
}

// export class GradientDescent extends Optimizer {
//     constructor(optimizable:GradientDescentOptimizable)
// }