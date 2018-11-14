import { Model } from './model';
export declare type TestResult = {
    prediction: number;
    target: number;
    confidence?: number;
};
export declare abstract class ScoringFunction extends Model<TestResult[], number> {
    abstract query(input: TestResult[]): number;
}
export declare class MAE extends ScoringFunction {
    constructor();
    query(input: TestResult[]): number;
}
export declare class RMSE extends ScoringFunction {
    constructor();
    query(input: TestResult[]): number;
}
