import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import GuidewireAPIClient from './GuidewireAPIClient';
import AbstractPolicyProcessor from './AbstractPolicyProcessor';
import PolicyCollectionTO from './PolicyCollectionTO';
import PolicyTO from './PolicyTO';

export class IssuancePolicyProcessor extends AbstractPolicyProcessor {

  public runAll(policies: PolicyCollectionTO): Promise {
    let jsons = this.readFilesFromDirectory('issuance')
    let guidewireClient = new GuidewireAPIClient();    
    return Promise.all(jsons)
    .then(results => {      
      let promises = [];
      results.forEach(result => {
        policies.ExternalProposalNumber++;
        let policy = new PolicyTO();
        policy.Logic = JSON.parse(result).id
        console.log("Logic:" + policy.Logic);
        let data = this
        .replaceVariables(result, policies.Date.toISOString(), policies.ExternalProposalNumber.toString());
                
        promises.push(guidewireClient
        .issuance(data)
        .then(policyNumber => {    
          console.log("Created policy " + policyNumber);
          policy.PolicyNumber = policyNumber;          
          policies.addPolicy(policy); 
          return policies;   
        }))        
      })      
      return promises;
    })    
  }

  public replaceVariables(data: string, date: string, externalProposalNumber: string): string {    
    data = data.replace(new RegExp("{{periodStartDate}}", 'g'), date);
    data = data.replace(new RegExp("{{insuredTaxID}}", 'g'), this.getCpf());
    data = data.replace(new RegExp("{{spouseTaxID}}", 'g'), this.getCpf());
    data = data.replace(new RegExp("{{externalProposalNumber_GCS}}", 'g'), externalProposalNumber.toString());          
    let chassi = Math.floor(Math.random()*1000000)+1;
    data = data.replace(new RegExp("{{chassi}}", 'g'), chassi.toString());      
    return data;    
  }

}

export default IssuancePolicyProcessor;