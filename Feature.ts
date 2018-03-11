export default class Feature extends Array{
    /**
     * Creates an instance of Feature.
     * @memberof Feature
     */
    constructor(public name:string, values?:number[]) {
        super(0);
    }
}

let x = new Feature('myfeature', [1,2]); 