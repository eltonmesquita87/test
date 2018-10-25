import * as Slackr from 'slack-incoming-webhook';
import {config} from 'node-config-ts';
import * as jsonExport from 'jsonexport';

export class Slacker {
    
  public sendMessage(message: string, channel: string = config.slack.channel) {        
    var slackURL = config.slack.url || 'https://hooks.slack.com/services/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' 
    let slack = Slackr({
      url: slackURL,
      channel: channel
    })    
    slack(message);
  }

  public postMessage(preText: string, message,  channel: string = config.slack.channel) {    
    var slackURL = config.slack.url || 'https://hooks.slack.com/services/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' 
    jsonExport(message, {rowDelimiter: ' | '}, function(err, csv) {            
      let slack = Slackr({
        url: slackURL,
        channel: channel,
        attachments: 	[{
          "pretext": "*" + preText + "*", 
          "text": csv, 
          "color": "good"}
        ]
      })
      slack();      
    })
  }

  public sendError(message: string) {
    var slackURL = config.slack.url || 'https://hooks.slack.com/services/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' 
    let channel = config.slack.channel_error || 'gw-jose-error'
    let slack = Slackr({
      url: slackURL,
      channel: channel,      
    })    
    slack(message);
  }
  
  

}

export default Slacker;