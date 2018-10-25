import Snowden from '../models/Snowden';
import SnowdenQuery from '../models/SnowdenQuery';
import Problem from '../models/Problem';
import GuidewireDatabase from './GuidewireDatabase';
import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import Slacker from './Slacker';
import MeeseeksProcessor from './MeeseeksProcessor';
import joseDatabase from './joseDatabase';
import { SnowdenQueryEvent } from '../models/SnowdenQueryEvent';
import EventsGLDatabase from './EventsGLDatabase';
import * as Sequelize from 'sequelize';

let fsAsync : any = Promise.promisifyAll(fs)

export class SnowdenProcessor {
  
  constructor() {

  }
  
  public execute(policyNumber: string = null, env: string = null): void {  
    env = env || config.guidewire.default_env || config.guidewire.envs[0];
    this.sendStartToSlack(policyNumber, env);
    Snowden.create({policy_number: policyNumber, environment: env})
    .then(snowdenCreated => {     
      let snowden = snowdenCreated
      let sqlsToExecute = this.readFilesFromDirectory(env, snowden, policyNumber)      
 
      this.waitForQueriesToFinalize(sqlsToExecute, snowden);
      return snowden
    })
    new MeeseeksProcessor().searchForToggles(env)
   
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
    let sqlFolder = config.sql_folder || './sql/schedule' 
    let folders = fs.readdirSync(sqlFolder)
    let sqlsToExecute = [];
    folders.forEach(folder => {
      let sqlPath = path.join(sqlFolder, folder);
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
    
    let snowdenQueries = SnowdenQuery.findAll({
      attributes: ['query_name'],
      where: {
        snowdenId: snowden.id
      }
    }).then(results =>{
        results.forEach(querys =>{
          var queryName=JSON.stringify(querys)
          queryName=queryName.replace('{"query_name":"','')
          queryName=queryName.replace('"}','')
          this.verifyMaxSnowdenQueryId(queryName) 
        })
    })
    
    
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
      this.verifySnowdenQueryEvent(snowden_query.query_name, response.recordset); 
       
    }
  }

  private executeSQLFromFile(data: string, snowden, snowdenQuery, env: string = null): Promise {    
    console.log("Executing SQL:" + snowdenQuery.query_name);
    return new GuidewireDatabase(env)
    .executeSQL(data.toString(), snowdenQuery, snowden.policy_number , this.handleQueryResponse);
  }


  private verifySnowdenQueryEvent(queryName: string, message){
        var Sequelize =require('sequelize');
        var syout=JSON.stringify(message)
        console.log("Verify Snowden Query Event! " + queryName);
        return SnowdenQueryEvent.find({    
          where: {
            queryname: queryName
            
          } 
         }).then(function(result) {
           if(!result){
              return 'not find'
           }
           console.log("SCRIPT FOUND IN DATABASE:"+syout)
           new EventsGLDatabase()
           .insertDataLog(queryName,syout)
           return result.dataValues
        })
        .catch(error => { 
          console.log("Error in Find Query Event: " + error);
          return null 
        })
  }

  private verifyMaxSnowdenQueryId(queryName){
     var Sequelize =require('sequelize');
     var maxSnowdenId =0
         SnowdenQuery.findAll({    
          attributes: [
            Sequelize.fn('MAX', Sequelize.col('snowdenId'))
          ],
         raw: true,
         }).then(result => {
           var objStr =JSON.stringify(result)
           objStr =objStr.replace(/[^0-9]/g,'')
           maxSnowdenId =parseInt(objStr)
           console.log("SNOWDENID : "+maxSnowdenId)
           this.verifyStatusProblem(maxSnowdenId, queryName)
         })
        .catch(error => { 
          console.log("Error in Find Query Event: " + error);
          return null 
        })

        
  }

  private verifyStatusProblem(maxSnowdenId,queryName){
    console.log("VALOR QUERY"+ queryName)
    var snowdenqueryId=SnowdenQuery.id
    SnowdenQuery.findAll({
      where: {query_name: queryName}, id: {[Sequelize.Op.eq]: snowdenqueryId},
        include: [{
        model: Problem,
        required: true
       }]
     }).then(result=> {
        var t= JSON.stringify(result)
        console.log("STEP"+t.length)
        if(t.length==2){
         new EventsGLDatabase()
         .updateStatusErrorGL(queryName)
         console.log("UPDATE"+result)
      }
    })
    .catch(error => { 
      console.log("Error in Find Query Event: " + error);
      return null 
    })
  }




  

}

export default SnowdenProcessor;