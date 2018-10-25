const request = require('request');
import Slacker from './Slacker';
import {config} from 'node-config-ts';

export class MeeseeksProcessor {
  
  constructor() {
  }

  public searchForToggles(env: string) {
    console.log("Searching meeseeks for toggles...")
    let meeseeksUrl = process.env.MEESEEKS_PREFIX_URL + "/" + env + "/bc/toggle?api_key=" + process.env.MEESEEKS_TOKEN
    request(meeseeksUrl, { json: true }, (err, res, body) => {		            
      var slacker = new Slacker();
      if (err) { 
        console.log(err); 
        slacker.sendError("Error connecting to meeseeks: " + err)
      } else {      
        if(!this.isToggleEnabled("ToggleCheckCapturedInvoicesOnBillingCloud", body)) {          
          slacker.sendMessage("Toggle ToggleCheckCapturedInvoicesOnBillingCloud off or not found!");  
          slacker.sendMessage("O toggle do prêmio ganho está desligado ou não existe (ToggleCheckCapturedInvoicesOnBillingCloud)", config.slack.channel_bas);  
        }
      }      
    });
  }  
  
  private isToggleEnabled(toggleName: string, body): boolean {
    let toggleBillingCloud = body.filter((object) => {				
      return object.name == "ToggleCheckCapturedInvoicesOnBillingCloud";					
    });
     
    let isEnabled = true;

    if(toggleBillingCloud[0] == undefined ||
      (toggleBillingCloud[0] != undefined &&
        toggleBillingCloud[0].value == 'false')) {
          isEnabled = false;
    } 

    return isEnabled;
  }

}


export default MeeseeksProcessor;