import GuidewireDatabase from '../GuidewireDatabase';
import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import * as http from 'http';
import * as rp from 'request-promise';
import * as soap from 'soap';
import TesterAPIClient from './TesterAPIClient';
import GuidewireAPIClient from './GuidewireAPIClient';
import IssuancePolicyProcessor from './IssuancePolicyProcessor';
import CancellationPolicyProcessor from './CancellationPolicyProcessor';
import PolicyCollectionTO from './PolicyCollectionTO';

let fsAsync : any = Promise.promisifyAll(fs)

export class TesterProcessor {

  policies: PolicyCollectionTO;
  env: string
  
  constructor(env: string = 'local') {
    this.policies = new PolicyCollectionTO();
    this.policies.ExternalProposalNumber = 200000000000;
    this.env = env;
  }

  public execute(): void {  
    let issuanceProcessor = new IssuancePolicyProcessor();
    let cancellationProcessor = new CancellationPolicyProcessor();
    let guideClient = new GuidewireAPIClient();
    let promises = this.startTests()
    .then(policies => {            
      issuanceProcessor.runAll(policies)       
      .then(issuances => {        
        Promise.all(issuances).then(results => {                          
          setTimeout( //For some reason if we don't wait a few seconds, even thought policy sent "OK" on issuance we can't cancelled yet. So we wait 3 seconds ¯\_(ツ)_/¯            
            function() {
              guideClient.delta(results[0].policies[0].PolicyNumber, 1);         
              cancellationProcessor.runAll(results[0]);
            }, 30000);          
        })
      })     
    })
    
    
  }

  private startTests(): Promise {
    return new TesterAPIClient()
    .findServerDate()
    .then(date => {
      this.policies.date = date;   
      return this.findCurrentExternalProposalNumber()    
      .then(externalProposalNumber => {        
        this.policies.externalProposalNumber = externalProposalNumber                
        return this.policies;
      });
    })  
  }

  private readFilesFromDirectory(basedir: string): Array<Promise> {
    let folderbasePath = './tester/jsons';
    let folderPath = path.join(folderbasePath, basedir);
    console.log("reading files...")
    let jsons = [];
    var fileNames = fs.readdirSync(folderPath)
    fileNames.forEach(fileName => {
      let filePath = path.join(folderPath, fileName);
      jsons
      .push(fsAsync.readFileAsync(filePath, 'utf-8')
      .then(data => {      
        return data;
      }))          
    })
    return jsons;
  }

  private findCurrentExternalProposalNumber(): Promise {
    return new GuidewireDatabase()
    .querySimpleSQL("select convert(bigint, max(externalproposalnumber_gcs)) + 1 as externalproposalnumber_gcs from pc_job", "policy_center")
    .then(results => {
      return results.recordset[0].externalproposalnumber_gcs      
    })
  }

}

export default TesterProcessor;