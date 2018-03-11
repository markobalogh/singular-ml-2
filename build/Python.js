"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem = require("fs");
const child_process_1 = require("child_process");
class PythonScript {
    constructor(filepath) {
        this.filepath = filepath;
        this.lines = [];
    }
    write() {
        filesystem.writeFileSync(this.filepath, String.prototype.concat(...this.lines));
    }
    delete(callback) {
        filesystem.unlink(this.filepath, callback);
    }
    append(line) {
        this.lines.push(line + '\n');
    }
    run(deleteAfterRun = true, callback) {
        if (deleteAfterRun) {
            child_process_1.exec('python3 ' + this.filepath, (error, stdout, stderr) => {
                this.delete();
            });
        }
        else {
            child_process_1.exec('python3 ' + this.filepath, callback);
        }
    }
}
exports.PythonScript = PythonScript;
//# sourceMappingURL=Python.js.map