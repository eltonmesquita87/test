import * as Slackr from 'slack-incoming-webhook';
import {config} from 'node-config-ts';
import * as jsonExport from 'jsonexport';

export class Slacker {
  
  public sendMessage(message: string) {
    let slack = Slackr({
      url: config.slack.url,
      channel: config.slack.channel
    })    
    slack(message);
  }

  public postMessage(preText: string, message) {
    jsonExport(message, {rowDelimiter: ' | '}, function(err, csv) {            
      let slack = Slackr({
        url: config.slack.url,
        channel: config.slack.channel,
        attachments: 	[{
          "pretext": "*" + preText + "*", 
          "text": csv, 
          "color": "good"}
        ]
      })
      slack();      
    })
  }


}

export default Slacker;