export declare class Model<inputType, outputType> {
    constructor(pipeChain?: Model<unknown, unknown>[]);
    protected pipeChain: Model<unknown, unknown>[];
    pipeTo<newOutputType>(model: Model<outputType, newOutputType>): Model<inputType, newOutputType>;
    query(input: inputType): outputType;
}
