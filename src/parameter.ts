/**
 * Class to control the behavior of parameters. When parameters are changed (by optimization algorithms for example) those changes can be monitored/controlled. 
 */
export class Parameter {
    constructor(public value:number, public fixed:boolean=false, public lowerBound:number=NaN, public upperBound:number=NaN) {
    }

    /**
     * Returns an array of parameters with the given `values`.
     */
    static vector(values:number[], fixed:boolean=false, lowerBound=NaN, upperBound=NaN):Parameter[] {
        return values.map(value=>new Parameter(value, fixed, lowerBound, upperBound));
    }
}