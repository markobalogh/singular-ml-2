"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor(pipeChain) {
        this.pipeChain = [];
        if (pipeChain) {
            this.pipeChain = pipeChain;
        }
    }
    static queryDecorator() {
        return function (target, propertyKey, descriptor) {
            descriptor.value = function (arg) {
                if (target.pipeChain.length != 0) {
                    let previousModelOutput = arg;
                    for (let i = 0; i < target.pipeChain.length; i++) {
                        previousModelOutput = target.pipeChain[i].query(previousModelOutput);
                    }
                    return previousModelOutput;
                }
                else {
                    return descriptor.value();
                }
            };
        };
    }
    pipeTo(model) {
        return new Model([this, model]);
    }
    // @Model.queryDecorator<inputType,outputType>() //we might not need the decorator...see comment below.
    query(input) {
        //whenever the query method is called on the model base class, that's because we have a composite model (formed via a pipeTo call). So we know that pipeChain will have nonzero length. Model subclasses will override the query method.
        let previousModelOutput = input;
        for (let i = 0; i < this.pipeChain.length; i++) {
            previousModelOutput = this.pipeChain[i].query(previousModelOutput);
        }
        return previousModelOutput;
    }
}
exports.Model = Model;
// export class ModelA extends Model<string,[number,number]> {
//     constructor() {
//         super();
//     }
//     query(input:string):[number,number] {
//         return [input.length, input.length/2];
//     }
// }
// export class ModelB extends Model<[number,number],number> {
//     constructor() {
//         super();
//     }
//     query(input:[number,number]):number {
//         return input[0]+input[1];
//     }
// }
// export class ModelC extends Model<number,string> {
//     constructor() {
//         super();
//     }
//     query(input:number):string {
//         return input.toString()+'isTheNumber';
//     }
// }
// export class NearestNeighbors extends Model<[number,number],number> {
// }
// export class Model2 extends Model<number,number> {
// }
// let x = new NearestNeighbors().pipeTo<number>(new Model2()).query()
// let x = new ModelA();
// console.log(x.query('hello'));
// let y = new ModelB();
// let z = x.pipeTo(y);
// let w = z.pipeTo(new ModelC());
// w = w.pipeTo(w)
// console.log(w.query('hello there'));
//# sourceMappingURL=model.js.map