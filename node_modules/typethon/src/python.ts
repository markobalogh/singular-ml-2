import * as filesystem from 'fs';
import {exec, execSync} from 'child_process'

export class PythonScript {
    lines: string[] = [];
    constructor(public filepath:string){ }
    
    write():void {
        filesystem.writeFileSync(this.filepath, String.prototype.concat(...this.lines));
    }

    delete(callback:(err:NodeJS.ErrnoException)=>void):void {
        filesystem.unlink(this.filepath, callback);
    }

    append(line:string):void {
        this.lines.push(line + '\n');
    } 

    run(deleteAfterRun:boolean=true, callback?:(error:Error|null, stdout:string, stderr:string)=>void):void {
        if (deleteAfterRun) {
            exec('python3 ' + this.filepath, (error, stdout, stderr)=>{
                this.delete(()=>{});
            });
        } else {
            exec('python3 ' + this.filepath, callback);
        }
    } 
}