/**
 * Class to control the behavior of parameters. When parameters are changed (by optimization algorithms for example) those changes can be monitored/controlled. 
 */
export class Parameter {
    constructor(public value:any, public fixed:boolean=false, public lowerBound:number=NaN, public upperBound:number=NaN) {
    }
}