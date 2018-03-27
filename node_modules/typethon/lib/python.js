"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var filesystem = __importStar(require("fs"));
var child_process_1 = require("child_process");
var PythonScript = /** @class */ (function () {
    function PythonScript(filepath) {
        this.filepath = filepath;
        this.lines = [];
    }
    PythonScript.prototype.write = function () {
        filesystem.writeFileSync(this.filepath, (_a = String.prototype).concat.apply(_a, this.lines));
        var _a;
    };
    PythonScript.prototype.delete = function (callback) {
        filesystem.unlink(this.filepath, callback);
    };
    PythonScript.prototype.append = function (line) {
        this.lines.push(line + '\n');
    };
    PythonScript.prototype.run = function (deleteAfterRun, callback) {
        var _this = this;
        if (deleteAfterRun === void 0) { deleteAfterRun = true; }
        if (deleteAfterRun) {
            child_process_1.exec('python3 ' + this.filepath, function (error, stdout, stderr) {
                _this.delete(function () { });
            });
        }
        else {
            child_process_1.exec('python3 ' + this.filepath, callback);
        }
    };
    return PythonScript;
}());
exports.PythonScript = PythonScript;
//# sourceMappingURL=python.js.map