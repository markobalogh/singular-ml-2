// import * as filesystem from 'fs';
// import {PythonScript} from 'typethon';

// export class Plotter {
//     constructor() {

//     }
//     /**
//      * Replicates a call to `matplotlib.plotter.plot(*args)`
//      * 
//      * @param {...any[]} args 
//      * @memberof Plotter
//      */
//     plot(...args: any[]) {
//         //create python script
//         var script = new PythonScript('./temp.py');
//         for (let i = 0; i < args.length; i++) {
//             this.saveData(('./plotter_data_' + String(i) + '.json'), args[i]);
//         }
//         //python imports
//         script.append('import matplotlib.pyplot as plotter')
//         script.append('import json');
//         //create plot
//         script.append('plotter.figure()');
//         script.append('plotter.grid(True)');
//         for (let i = 0; i < args.length; i++) {
//             script.append("with open('./plotter_data_" + String(i) + ".json', 'r') as openfile:")
//             script.append('    data_' + String(i) + ' = json.load(openfile)');
//         }
//         let temp:string[] = [];
//         for (let i = 0; i < args.length-1; i++) {
//             temp.push('data_' + String(i) + ', ')
//         }
//         script.append('plotter.plot(' + String.prototype.concat(...temp) + 'data_' + String(args.length-1) + ')');
//         script.append('plotter.show()');
//         //execute python script
//         script.write();
//         script.run(true, (error, stdout, stderr)=>{
//             if (error) {
//                 console.log(error);
//             }
//             if (stdout) {
//                 console.log(stdout);
//             }
//             if (stderr) {
//                 console.log(stderr);
//             }
//         });
//         //clean up
//         setTimeout(()=>{
//             for (let i = 0; i < args.length; i++) {
//                 filesystem.unlinkSync(('./plotter_data_' + String(i) + '.json'));
//             }
//         }, 2000)
//     }

//     private saveData(filepath:string, data:any) {
//         filesystem.writeFileSync(filepath, JSON.stringify(data));
//     }
// }

// // let x = new Plotter();
// // x.plot([1,2,3], [2,4,6])