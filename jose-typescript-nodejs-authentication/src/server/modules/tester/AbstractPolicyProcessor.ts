import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import GuidewireAPIClient from './GuidewireAPIClient';
import * as path from 'path';
import * as fs from 'fs';

let fsAsync : any = Promise.promisifyAll(fs)

export abstract class AbstractPolicyProcessor {

  public readFilesFromDirectory(basedir: string): Array<Promise> {
    let folderbasePath = './tester/jsons';
    let folderPath = path.join(folderbasePath, basedir);
    console.log("reading files...")
    let jsons = [];
    var fileNames = fs.readdirSync(folderPath)
    fileNames.forEach(fileName => {
      let filePath = path.join(folderPath, fileName);
      jsons.push(fsAsync.readFileAsync(filePath, 'utf-8'))       
    })
    return jsons;
  }

  public getCpf() {
    var cpfvar = "0"

    var n = 9;
    var n1 = Math.round(Math.random()*n);
    var n2 = Math.round(Math.random()*n);
    var n3 = Math.round(Math.random()*n);
    var n4 = Math.round(Math.random()*n);
    var n5 = Math.round(Math.random()*n);
    var n6 = Math.round(Math.random()*n);
    var n7 = Math.round(Math.random()*n);
    var n8 = Math.round(Math.random()*n);
    var n9 = Math.round(Math.random()*n);
    var d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    
    var dividendo = d1
    var divisor = 11
    d1 = 11 - (Math.round(dividendo - (Math.floor(dividendo/divisor) * divisor)))
    
    if (d1 >= 10) d1 = 0;
    var d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 *  5+ n6 *  6+ n5 * 7 + n4 *8 + n3 * 9 + n2 * 10 + n1 * 11;
    
    dividendo = d2
    divisor = 11
    d2 = 11 - (Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor)))
    
    if (d2>=10) d2 = 0;    
    
    cpfvar = '' + n1+ n2 + n3 + '.' + n4 +n5 + n6 + '.' + n7 + n8 + n9 + '-' + d1 + d2;
    return cpfvar;
}

}

export default AbstractPolicyProcessor;