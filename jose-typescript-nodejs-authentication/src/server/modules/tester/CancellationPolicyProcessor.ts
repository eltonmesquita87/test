import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import GuidewireAPIClient from './GuidewireAPIClient';
import AbstractPolicyProcessor from './AbstractPolicyProcessor';
import PolicyCollectionTO from './PolicyCollectionTO';
import PolicyTO from './PolicyTO';

export class CancellationPolicyProcessor extends AbstractPolicyProcessor {

  public runAll(policies: PolicyCollectionTO): Promise {
    let jsons = this.readFilesFromDirectory('cancellation')
    let guidewireClient = new GuidewireAPIClient();
    return Promise.all(jsons).then(results => {      
      return results.forEach(result => {
        policies.Policies.forEach(policy => {
          let data = this
          .replaceVariables(result, policy.PolicyNumber.toString());

          return guidewireClient          
          .cancellation(data)
          .then(body => {         
            return body;
          })
        })        
      })
    })
  }

  public replaceVariables(data: string, policyNumber: string): string {    
    data = data.replace(new RegExp("{{policyNumber}}", 'g'), policyNumber);   
    return data;    
  }

}

export default CancellationPolicyProcessor;