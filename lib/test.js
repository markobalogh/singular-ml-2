"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testEnum;
(function (testEnum) {
    testEnum[testEnum["option1"] = 0] = "option1";
    testEnum[testEnum["option2"] = 1] = "option2";
})(testEnum = exports.testEnum || (exports.testEnum = {}));
class tester {
    constructor(option) {
        this.option = option;
    }
}
exports.tester = tester;
let x = new tester(testEnum.option1);
console.log(x.option);
//# sourceMappingURL=test.js.map