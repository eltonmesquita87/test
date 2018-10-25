import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import GuidewireAPIClient from './GuidewireAPIClient';
import AbstractPolicyProcessor from './AbstractPolicyProcessor';
import PolicyCollectionTO from './PolicyCollectionTO';
import PolicyTO from './PolicyTO';

export class PolicyChangePolicyProcessor extends AbstractPolicyProcessor {

  public runAll(policies: PolicyCollectionTO): Promise {
    let policiesAuto = policies.Policies.find(x => x.Logic === 1 || x.Logic === 2);
    this.readFilesFromDirectory('policy_change/auto/1')

  }    

  public replaceVariables(policyNumber: string, data: string, date: string, externalProposalNumber: string): string {    
    data = data.replace(new RegExp("{{policyNumber}}", 'g'), policyNumber);
    data = data.replace(new RegExp("{{periodStartDate}}", 'g'), date);        
    data = data.replace(new RegExp("{{externalProposalNumber_GCS}}", 'g'), externalProposalNumber.toString());          
    let chassi = Math.floor(Math.random()*1000000)+1;
    data = data.replace(new RegExp("{{chassi}}", 'g'), chassi.toString());      
    return data;    
  }

}

export default PolicyChangePolicyProcessor;