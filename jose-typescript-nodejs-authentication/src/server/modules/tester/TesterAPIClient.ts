import GuidewireDatabase from '../GuidewireDatabase';
import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import * as http from 'http';
import * as rp from 'request-promise';
import * as soap from 'soap';

export class GuidewireAPIClient {

  private clientClient(center: string = 'billing_center'): Promise {
    let url = 'http://localhost:8580/bc/ws/br/com/gcs/webservice/tester/TesterAPI';
    if(center == "policy_center") {
      url = 'http://localhost:8180/pc/ws/br/com/gcs/webservice/tester/TesterAPI';
    }     
    return soap.createClientAsync(url + "?WSDL")
    .then((client) => {
      let soapHeader = {
        'authentication': {
          'username': 'integration_usr',
          'password': 'gw'
        }
      };
      client.addSoapHeader(soapHeader, "", "soap", "http://guidewire.com/ws/soapheaders");
             
      client.setEndpoint(url + '/soap11');
      return client;
    })
  }

  public findServerDate(): Promise {
    return this.clientClient()
    .then((client) => {      
      return client.getServerDateAsync();
    }).then((result) => {            
      return (result.return as Date);
    });     
  }

  public addDaysToClock(days: number, center: string = 'billing_center'): Promise {
    return this.clientClient(center)
    .then(client => {
      return client.addDaysToClockAsync(days);
    }).then((result) => {            
      return (result.return as Date).toISOString();
    }); 
  }
}

export default GuidewireAPIClient;