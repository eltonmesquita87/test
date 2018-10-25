import * as Promise from 'bluebird';
import {config} from 'node-config-ts';
import * as http from 'http';
import * as rp from 'request-promise';
import * as soap from 'soap';

export class GuidewireAPIClient {

  public issuance(json: any): Promise {

    console.log("Calling issuance in Guidewire...")

    let options = {
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
        "Authorization": "Basic cHU6cGFzc3dvcmQ=",
        "UserToken": "aarmstrong"
      },
      uri: 'http://localhost:8180/pc/service/edge/quote/quote',
      body: json
    };

    return rp(options)
    .then(body => {
        let jsonResponse = JSON.parse(body);               
        return jsonResponse.result.bindData.policyNumber;
    });       
  }

  public cancellation(json: any): Promise {        
    console.log("Calling cancellation in Guidewire...")
    let options = {
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
        "Authorization": "Basic aW50ZWdyYXRpb25fdXNyOmd3",
        "UserToken": "aarmstrong"
      },
      uri: 'http://localhost:8180/pc/service/edge/cancellation/cancellation',
      body: json      
    };

    console.log(options);
    return rp(options)
    .then(body => {
        console.log(body);
        return body;
    });       
    
  }

  public delta(policyNumber: string, installmentNumber: number): Promise {
    console.log("Sending delta for policy " + policyNumber + " invoice " + installmentNumber);
    let url = 'http://localhost:8580/bc/ws/br/com/gcs/webservice/sap/delta/GCS_Delta';   
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
      let payments = {
        payments: {
          Entry: {
            AggrementCode_GCS: 'ZZCONID',
            Amount: 100,
            AmountReceived: 100,
            BankCode_GCS: 104,
            IDLG: 'A02A0A0' + policyNumber + '00000000000000000' + installmentNumber,
            InstallmentNumber: installmentNumber,
            Interest: 0,
            LateFee: 0,
            PaymentInstrumentToken: 'Groot',
            PaymentInstumentMethod: 'creditcard',
            PolicyNumber: policyNumber,
            ReceivedDate: '2018-01-01',
            ReturnCodeOfBank_GCS: 0,
            ReturnDateSAP_GCS: '2018-01-01',
            ReturnDescriptionOfBank_GCS: 'cleared',
            SequentialFileBank: '0',
            SequentialFileSAP: 'I am Groot'
          }
        }
      }
      client.receiveInvoicesStatusAsync(payments)
    })
  }
}

export default GuidewireAPIClient;