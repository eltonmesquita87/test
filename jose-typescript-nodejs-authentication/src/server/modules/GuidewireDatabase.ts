import * as sql from 'mssql';
import {config} from 'node-config-ts';
import Slacker from './Slacker';
import * as Promise from 'bluebird';

export class GuidewireDatabase {

  env :string;

  constructor(env: string = null) {
    if(env == null) {      
      env = config.guidewire.default_env || config.guidewire.envs[0]      
    }
    this.env = env.toUpperCase();
  }
  
	private database_config(center: string) {
    var guidewirePort = process.env['GUIDEWIRE_PORT_' + this.env] || '1433' 
    let timeout = process.env.GUIDEWIRE_TIMEOUT || 180000

    return {      
		  user: process.env['GUIDEWIRE_USER_NAME_' + this.env],
		  password: process.env['GUIDEWIRE_PASSWORD_' + this.env],
      server:  process.env['GUIDEWIRE_HOSTNAME_' + this.env],
      port: guidewirePort,
		  database:  this.centers_database()[center],
      requestTimeout : timeout
    };
  }

  private centers_database() { 
    return {
      'billing_center': process.env['GUIDEWIRE_BILLING_CENTER_DATABASE_' + this.env],
      'claim_center': process.env['GUIDEWIRE_CLAIM_CENTER_DATABASE_' + this.env],
      'policy_center': process.env['GUIDEWIRE_POLICY_CENTER_DATABASE_' + this.env],
      'contact_manager': process.env['GUIDEWIRE_CONTACT_MANAGER_DATABASE_' + this.env]
    };
  };

  private centers_policy_table = {
    'billing_center': 'BC_POLICYPERIOD',
    'claim_center': 'CC_POLICY',
    'policy_center': 'PC_POLICYPERIOD'
  };

  public getEnvs(): Array<string> {
    console.log(config.guidewire.envs);
    var envsSplit = config.guidewire.envs.toString().split(',');
    let envs = []
    envsSplit.forEach(env => {
      envs.push({env: env})
    })
    return envs;  
  }

  public executeSQL(sqlString: string, snowden_query, policyNumber: string, callbackFunction: (result, snowden_query) => void) {                
    let normalizedSQL = this.normalizeSQLString(sqlString)
    if(this.shouldAddPolicyNumber(normalizedSQL, policyNumber, snowden_query.center)) {
      normalizedSQL = this.addPolicyNumber(normalizedSQL, policyNumber)
    }
    return new sql.ConnectionPool(this.database_config(snowden_query.center))
    .connect()
    .then(pool => {      
      return pool
      .request()
      .query(normalizedSQL);
    }).then(result => {   
      callbackFunction(result, snowden_query);      
      return result;
    }).catch(err => {
      let message = "Error!!! on Query " + snowden_query.query_name + " please verify: " + err + " query is: " + normalizedSQL; 
      console.log(message);
      new Slacker().sendError(message);
      let result = {
        rowsAffected: 0  
      }      
      return result;
    })
  }

  private normalizeSQLString(sql: string): string {
    let normalizedSQL = sql.toUpperCase()    
    let formatedDate = this.formatDateForQuery(new Date())

    normalizedSQL = normalizedSQL.replace(new RegExp("<POLICYCENTER>", 'g'), this.centers_database()['policy_center'] )
    normalizedSQL = normalizedSQL.replace(new RegExp("<CLAIMCENTER>", 'g'), this.centers_database()['claim_center'] )
    normalizedSQL = normalizedSQL.replace(new RegExp("<BILLINGCENTER>", 'g'), this.centers_database()['billing_center'] )
    normalizedSQL = normalizedSQL.replace(new RegExp("<CONTACTMANAGER>", 'g'), this.centers_database()['contact_manager'] )
    normalizedSQL = normalizedSQL.replace(new RegExp("<MONTH>", 'g'), formatedDate)
    
    return normalizedSQL;
  }  

  private formatDateForQuery(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + '01',
        year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;  

    return [year, month, day].join('-');
  }


  private addPolicyNumber(sql: string, policyNumber: string): string {
    if(sql.toString().includes("WHERE")) {
      sql += " AND POLICYNUMBER = '" + policyNumber + "'";
    }
    else {
      sql += " WHERE POLICYNUMBER = '" + policyNumber + "'";
    }    
    return sql;
  }

  private shouldAddPolicyNumber(sql: string, policyNumber: string, center: string): boolean {
    return policyNumber != null 
      && sql.toString().includes(this.centers_policy_table[center]);
  }

  public querySimpleSQL(sqlString: string, center: string): Promise {                    
    return new sql.ConnectionPool(this.database_config(center))
    .connect()
    .then(pool => {      
      return pool
      .request()
      .query(sqlString);
    }).then(result => {         
      return result;
    }).catch(err => {
      let message = "Error!!! on Query please verify: " + err + " query is: " + sqlString; 
      console.log(message);      
    })
  }

}

export default GuidewireDatabase;