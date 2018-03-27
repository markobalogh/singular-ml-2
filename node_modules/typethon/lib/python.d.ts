/// <reference types="node" />
export declare class PythonScript {
    filepath: string;
    lines: string[];
    constructor(filepath: string);
    write(): void;
    delete(callback: (err: NodeJS.ErrnoException) => void): void;
    append(line: string): void;
    run(deleteAfterRun?: boolean, callback?: (error: Error | null, stdout: string, stderr: string) => void): void;
}
