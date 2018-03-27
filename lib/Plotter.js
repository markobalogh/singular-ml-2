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
var typethon_1 = require("typethon");
var Plotter = /** @class */ (function () {
    function Plotter() {
    }
    /**
     * Replicates a call to `matplotlib.plotter.plot(*args)`
     *
     * @param {...any[]} args
     * @memberof Plotter
     */
    Plotter.prototype.plot = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        //create python script
        var script = new typethon_1.PythonScript('./temp.py');
        for (var i = 0; i < args.length; i++) {
            this.saveData(('./plotter_data_' + String(i) + '.json'), args[i]);
        }
        //python imports
        script.append('import matplotlib.pyplot as plotter');
        script.append('import json');
        //create plot
        script.append('plotter.figure()');
        script.append('plotter.grid(True)');
        for (var i = 0; i < args.length; i++) {
            script.append("with open('./plotter_data_" + String(i) + ".json', 'r') as openfile:");
            script.append('    data_' + String(i) + ' = json.load(openfile)');
        }
        var temp = [];
        for (var i = 0; i < args.length - 1; i++) {
            temp.push('data_' + String(i) + ', ');
        }
        script.append('plotter.plot(' + (_a = String.prototype).concat.apply(_a, temp) + 'data_' + String(args.length - 1) + ')');
        script.append('plotter.show()');
        //execute python script
        script.write();
        script.run(true, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.log(stderr);
            }
        });
        //clean up
        setTimeout(function () {
            for (var i = 0; i < args.length; i++) {
                filesystem.unlinkSync(('./plotter_data_' + String(i) + '.json'));
            }
        }, 2000);
        var _a;
    };
    Plotter.prototype.saveData = function (filepath, data) {
        filesystem.writeFileSync(filepath, JSON.stringify(data));
    };
    return Plotter;
}());
exports.Plotter = Plotter;
// let x = new Plotter();
// x.plot([1,2,3], [2,4,6])
//# sourceMappingURL=Plotter.js.map