import Snowden from '../models/Snowden';
import SnowdenQuery from '../models/SnowdenQuery';
import Problem from '../models/Problem';
import GuidewireDatabase from './GuidewireDatabase';
import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import Slacker from './Slacker';

let fsAsync : any = Promise.promisifyAll(fs)

export class SnowdenProcessor {
  
  constructor() {

  }
  
  public execute(policyNumber: string = null, env: string = null): void {  
    env = env || config.guidewire.default_env;
    this.sendStartToSlack(policyNumber, env);
    Snowden.create({policy_number: policyNumber, environment: env})
    .then(snowdenCreated => {     
      let snowden = snowdenCreated
      let sqlsToExecute = this.readFilesFromDirectory(env, snowden, policyNumber)      
 
      this.waitForQueriesToFinalize(sqlsToExecute, snowden);
      return snowden
    })
  }

  private sendStartToSlack(policyNumber: string = null, env: string = null) {
    let message = "Snowding Guidewire"
    if(policyNumber != null) {
      message += " for PolicyNumber " + policyNumber 
    }
    if(env != null) {
      message += " On Environment " + env
    }
    message += "!!"
    console.log(message);
    new Slacker().sendMessage(message);  
  }

  private readFilesFromDirectory(env: string, snowden, policyNumber: string): Array<Promise> {
    let folders = fs.readdirSync(config.sql_folder)
    let sqlsToExecute = [];
    folders.forEach(folder => {
      let sqlPath = path.join(config.sql_folder, folder);
      var fileNames = fs.readdirSync(sqlPath)
      fileNames.forEach(fileName => {
        let filePath = path.join(sqlPath, fileName);
        sqlsToExecute
        .push(fsAsync.readFileAsync(filePath, 'utf-8')
        .then(data => {      
          return SnowdenQuery.create({center: folder, query_name: fileName, snowdenId: snowden.id})
          .then(snowdenQuery => { return this.executeSQLFromFile(data, snowden, snowdenQuery, env) })
        }))          
      })
    })
    return sqlsToExecute;
  }

  private waitForQueriesToFinalize(sqlsToExecute: Array<Promise>, snowden) {
    Promise.all(sqlsToExecute).then(results => {
      this.finalizeSnowden(results, snowden);
    })
  }

  private finalizeSnowden(results: Promise, snowden) {
    let problems_found = 0
    results.forEach(result => {
      problems_found += parseInt(result.rowsAffected)
    })
    snowden.problems_found = problems_found
    snowden.ended_at = Date.now();
    snowden.save();  

    new Slacker().sendMessage("Snowning finished with " + parseInt(problems_found.toString()) + " errors");
  }

  public handleQueryResponse = (response, snowden_query): void => {     
    if(parseInt(response.rowsAffected) > 0) { 
      response.recordset.forEach(row => {              
        Problem.create({
          results: JSON.stringify(row), 
          snowdenqueryId: snowden_query.id
        })
      })
          
      new Slacker().postMessage(snowden_query.query_name, response.recordset);    
    }
  }

  private executeSQLFromFile(data: string, snowden, snowdenQuery, env: string = null): Promise {    
    console.log("Executing SQL:" + snowdenQuery.query_name);
    return new GuidewireDatabase(env)
    .executeSQL(data.toString(), snowdenQuery, snowden.policy_number , this.handleQueryResponse);
  }
  

}

export default SnowdenProcessor;