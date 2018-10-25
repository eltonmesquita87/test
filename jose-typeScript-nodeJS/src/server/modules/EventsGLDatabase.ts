import * as sql from 'mssql';
import {config} from 'node-config-ts';
import * as Promise from 'bluebird';
export class EventsGLDatabase {
    
   private database_config() {
        return {
                user: config.eventsGL.user_name,
                password: config.eventsGL.password,
                server: config.eventsGL.host_name,
                database: config.eventsGL.default_database,
            requestTimeout : 60000
        };
  }

  private findColumnTypeAdjust(event: String): String{
    let strAdjust: String
    if(event.indexOf("11") != -1){
        strAdjust = 'adjustPolicy';
    }else{
        strAdjust = 'adjustClaim';
    }
    return strAdjust;
  }

  public executeStoredProcedure(requestData): Promise{   
    let self = this;
    var dbConn = new sql.ConnectionPool(this.database_config());
    return dbConn.connect().then(connect => {         
        var request = new sql.Request(dbConn);
        request.input('adjustDateIni', sql.VarChar(19), requestData.data.startdate + ' 00:00:00')
        request.input('adjustDateFim', sql.VarChar(19), requestData.data.enddate + ' 23:59:59')
        request.input('adjustSufixNameLot', sql.VarChar(4), requestData.data.filename)
        request.input(self.findColumnTypeAdjust(requestData.data.typeEvent), sql.VarChar(20), requestData.data.number)
        request.output('outidlote', sql.Int)
        return request.execute('spGLInterface'+requestData.data.typeEvent+'Adjust').then(recordSet => {            
            dbConn.close(); 
            return recordSet.output;                      
        }).catch(err => {
            console.log('Error ao executar procedure: ' , err);
            dbConn.close();            
        });
    }).catch(err => {
        console.log('could not connect: ' , err);
    });   
  }   

  public filterByDate(beginDate: string, endDate: string = null, eventGL: string = null): Promise {
    let sqlString = "Select * FROM GL_TRANSACTION_LOT WHERE CreateTime between @beginDate and @endDate "
                    + " and EventGL= @eventGL"
    if(endDate == null){
        endDate = '9999-12-31';  
    }
    if(eventGL == null){  
      sqlString = "Select * FROM GL_TRANSACTION_LOT WHERE CreateTime between @beginDate and @endDate "
    } 
    return new sql.ConnectionPool(this.database_config())
    .connect()
    .then(pool => {      
       return pool
      .request()
      .input('beginDate', sql.VarChar(19), beginDate + ' 00:00:00')
      .input('endDate', sql.VarChar(19), endDate + ' 23:59:59')
      .input('eventGL',sql.VarChar(4), eventGL)
      .query(sqlString)
      .then(result => {
        return result;    
      }).catch(err => {
        let message = "Error!!! on Query please verify: " + err + " query is: " + sqlString; 
        console.log(message);        
      })  
    })
  }

  public executeSequence(): Promise {
   let sqlString = "select next value for dbo.sequence_sufix_file as sequence"
     return new sql.ConnectionPool(this.database_config())
    .connect()
    .then(pool => {      
       return pool
    .request()
    .query(sqlString)
    .then(result => {
        return result.recordset;               
      }).catch(err => {
        let message = "Error!!! on Query please verify: " + err + " query is: " + sqlString; 
        console.log(message);        
      })  
    })
  }

  public resetSequence(): Promise {
    let sqlString = "ALTER SEQUENCE dbo.sequence_sufix_file RESTART WITH 1"
      return new sql.ConnectionPool(this.database_config())
     .connect()
     .then(pool => {      
        return pool
     .request()
     .query(sqlString)
     .then(result => {
         return result.recordset;               
       }).catch(err => {
         let message = "Error!!! on Query please verify: " + err + " query is: " + sqlString; 
         console.log(message);        
       })  
     })
   }
 



}

export default EventsGLDatabase;