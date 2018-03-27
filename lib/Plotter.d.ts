export declare class Plotter {
    constructor();
    /**
     * Replicates a call to `matplotlib.plotter.plot(*args)`
     *
     * @param {...any[]} args
     * @memberof Plotter
     */
    plot(...args: any[]): void;
    private saveData(filepath, data);
}
