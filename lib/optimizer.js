"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParallelController = require("paralleljs");
const os = require("os");
class Optimizer {
    constructor() {
        /**
         * The number of threads *used at the level of the logic of the Optimizer*. This means that `this.optimizable.objective()` will be called `numberOfThreads` times in parallel. It is possible that `this.optimizable.objective()` incorporates parallelism `within it`, in which case `numberOfThreads` should be set with that in mind.
         *
         * The default behavior is that `numberOfThreads` is equal to `os.cpus().length`, the number of virtual cores on the host.
         */
        this.numberOfThreads = os.cpus().length;
        /**
         * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `timeLimit` seconds.
         */
        this.timeLimit = Infinity;
        /**
         * Stores a timestamp of when `this.maximize()` or `this.minimize()` was called last.
         */
        this.startTime = NaN;
        /**
         * Any call to `this.maximize()` or `this.minimize()` will be forced to return after `evalLimit` evaluations of the objective function.
         */
        this.evalLimit = Infinity;
        /**
         * An array of functions through which the optimizer instance is passed (in order) before the optimizable's objective function is called. If any of these functions throw an error, `optimizer.maximize()` and `optimizer.minimize()` will return. By convention, it is the input pipeline's responsibility to determine appropriate values for `this.objectiveInput` during each iteration of the loop in `this.maximize()`. Of course the input pipeline has at its disposal the results of any previous objective calls in `thisObj`.
         */
        this.evalCount = 0;
        this.inputPipeline = [
            function (thisObj) {
                if ((Date.now() - thisObj.startTime) > (1000 * thisObj.timeLimit)) {
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
        this.outputPipeline = [];
        /**
         * Each element of this array is an input vector that optimizable.parameters will be set to immediately before the objective function is called. There are multiple such input vectors in the case that `this.numberOfThreads` is greater than one. This array is passed through `this.optimizable.objective()`, parallelized over `this.numberOfThreads`.
         */
        this.objectiveInput = Array(this.numberOfThreads).fill(Array(this.optimizable.parameters.length).fill(NaN));
        /**
         * This property stores the value of the objective function immediately after it returns. This array holds one value per thread in `this.numberOfThreads`. If the objective function has not been called since the creation of `this`, the value of `objectiveOutput` is `Array(this.numberOfThreads).fill(NaN)`.
         */
        this.objectiveOutput = Array(this.numberOfThreads).fill(NaN);
    }
    withTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
        return this;
    }
    withEvalLimit(evalLimit) {
        this.evalLimit = evalLimit;
        return this;
    }
    withFreeParameters(freeParameters) {
        for (let parameter of this.optimizable.parameters) {
            if (freeParameters.includes(parameter)) {
                parameter.fixed = false;
            }
            else {
                parameter.fixed = true;
            }
            parameter.fixed = false;
        }
        return this;
    }
    maximize() {
        this.startTime = Date.now();
        //optimization loop
        while (true) {
            try {
                for (let n = 0; n < this.inputPipeline.length; n++) {
                    this.inputPipeline[n](this);
                }
                let parallelController = new ParallelController(this.objectiveInput, {
                    maxWorkers: this.numberOfThreads
                });
                function helper(arg) {
                    for (let i = 0; i < arg.optimizable.parameters.length; i++) {
                        arg.optimizable.parameters[i].value = arg.inputVector[i];
                    }
                    ;
                    arg.outputPlaceholder = arg.optimizable.objective();
                    return arg;
                }
                this.evalCount += this.numberOfThreads;
                parallelController.map(helper).then((data) => {
                    console.log(data);
                });
                for (let n = 0; n < this.outputPipeline.length; n++) {
                    this.outputPipeline[n](this);
                }
            }
            catch (err) {
                console.log(err);
                return this;
            }
        }
    }
    minimize() {
        this.outputPipeline.push((thisobj) => {
            //minimization should occur naturally if we multiply the objective output by negative one.
            thisobj.objectiveOutput = this.objectiveOutput.map(value => (value * -1));
        });
        return this.maximize();
    }
}
exports.Optimizer = Optimizer;
// export class GridSearch extends Optimizer {
//     constructor(optimizable:Optimizable) {
//         super();
//     }
// }
class RandomSearch extends Optimizer {
    constructor(optimizable, numberOfThreads = os.cpus().length) {
        super();
        this.optimizable = optimizable;
        this.numberOfThreads = numberOfThreads;
        this.initializeOptimizationLogic();
    }
    initializeOptimizationLogic() {
        this.inputPipeline.push((thisObj) => {
            thisObj.objectiveInput = Array(thisObj.numberOfThreads).map(value => {
                return thisObj.optimizable.parameters.map((parameter) => {
                    return parameter.lowerBound + (Math.random() * (parameter.upperBound - parameter.lowerBound));
                });
            });
        });
    }
}
exports.RandomSearch = RandomSearch;
// export class GradientDescent extends Optimizer {
//     constructor(optimizable:GradientDescentOptimizable)
// }
//# sourceMappingURL=optimizer.js.map