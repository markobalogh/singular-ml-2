/**
 * Class to control the behavior of parameters. When parameters are changed (by optimization algorithms for example) those changes can be monitored/controlled.
 */
export declare class Parameter {
    value: number;
    fixed: boolean;
    lowerBound: number;
    upperBound: number;
    constructor(value: number, fixed?: boolean, lowerBound?: number, upperBound?: number);
}
