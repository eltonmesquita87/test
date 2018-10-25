import * as sql from 'mssql';
import {config} from 'node-config-ts';
import * as Promise from 'bluebird';
import Slacker from './Slacker';
import { stringify } from 'querystring';

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
        request.input('adjustDateIni', sql.VarChar(19), requestData.startdate + ' 00:00:00')
        request.input('adjustDateFim', sql.VarChar(19), requestData.enddate + ' 23:59:59')
        request.input('adjustSufixNameLot', sql.VarChar(4), requestData.filename)
        request.input(self.findColumnTypeAdjust(requestData.typeEvent), sql.VarChar(20), requestData.number)
        request.output('outidlote', sql.Int)
        return request.execute('spGLInterface'+requestData.typeEvent+'Adjust').then(recordSet => {            
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
    let sqlString = "Select left(FileName, 22) + ' ' + substring(FileName, 23, 100) FileName, LotNumber, "
                    + " convert(CHAR,CreateTime,105) CreateTime, EventGL, TotalLotValue, ProcessStatus FROM GL_TRANSACTION_LOT "
                    + " WHERE CreateTime between @beginDate and @endDate "
                    + " and EventGL= @eventGL and LineNumber > 0 "
    if(endDate == null){
        endDate = '9999-12-31';  
    }
    if(eventGL == null){  
      sqlString = "Select left(FileName, 22) + ' ' + substring(FileName, 23, 100) FileName, "
      + " LotNumber, convert(CHAR,CreateTime,105) CreateTime, EventGL, TotalLotValue, ProcessStatus FROM GL_TRANSACTION_LOT  "
      + " WHERE CreateTime between @beginDate and @endDate and LineNumber > 0 "
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
  
   public findErrorGL(): Promise {
      let sqlString = "select distinct dt.EventGL,concat(de.ErrorNumber,'-', de.ErrorMessage) as MessageError"
                     + " from [dbo].[GL_DATALOAD_LOG] dt "
                     + " inner join [dbo].[GL_DATALOAD_ERRORLOG] de on dt.ID=de.DataLoadID "
                     + " where dt.ProcessStatus <> 'ADJUSTED' "
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

    
   public insertErrorGL(queryName :string , message :string): Promise{
      var json=JSON.parse(message)
     
     
      var policyNumber=message.substring(18,31)
      queryName=queryName.replace('sql','')
      let sqlString="INSERT INTO GL_DATALOAD_ERRORLOG "
                   + " (CreateTime, ErrorNumber, ErrorMessage, RelatedPolicyNumber, UpdateTime, Retired,DataLoadID)"
                   + " values (getdate(),"+queryName.substring(0,2)+","+"'"+queryName.substring(3,59)+"'"+","+policyNumber+",getdate(),0,(select MAX(ID) FROM GL_DATALOAD_LOG))"
       console.log("PAYLOAD"+ message)
       
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


    public insertDataLog(queryName :string , message :string):Promise{
      let insertDataLog="INSERT INTO GL_DATALOAD_LOG "
                         + " (EventGL, CreateTime,EventDateGL,ProcessStatus,UpdateTime,Retired) "
                         + " values ('1101_E', getdate(),getdate(),'ERROR',getdate(),0 )"
       return new sql.ConnectionPool(this.database_config())
      .connect()
      .then(pool => {      
        return pool
      .request()
      .query(insertDataLog)
      .then(result => {
        this.insertErrorGL(queryName,message) 
        return result.recordset;    
       }).catch(err => {
         let message = "Error!!! on Query please verify: " + err + " query is: " + insertDataLog; 
         console.log(message);        
      })  
        
     }) 
        
    }

    public updateStatusErrorGL(queryName){
      queryName=queryName.replace('sql','')
      let updateDataLog="update [dbo].[GL_DATALOAD_LOG]"
                         + " set ProcessStatus='ADJUSTED' "
                         + " where id in ( "
                         + "  select el.DataLoadID from GL_DATALOAD_ERRORLOG el where concat(el.ErrorNumber ,'-', "
                         + "  el.ErrorMessage) like '%"+queryName+"%' "
                         + " )"
      console.log("UPDATE DATALOG"+ updateDataLog)
      return new sql.ConnectionPool(this.database_config())
      .connect()
      .then(pool => {      
         return pool
      .request()
      .query(updateDataLog)
       .then(result => {
          return result.recordset;    
       }).catch(err => {
        let message = "Error!!! on Query please verify: " + err + " query is: " + updateDataLog; 
        console.log(message);        
      })  
                           
     }) 
    }

    public readGLInterface(){
      let sqlString="select * from gl_transaction_lot"
                     +" where createtime between ( getdate()-180) and (getdate() ) "
                     +" and processstatus in (1,2)"
      return new sql.ConnectionPool(this.database_config())
      .connect()
      .then(pool => {
        return pool
      .request()
      .query(sqlString)
       .then(result => {
         let sql  = JSON.stringify(result) 
         console.log("READGLInterface" + sql)
         return result.recordset;    
        }).catch(err => {
        let message = "Error!!! on Query please verify: " + err + " query is: " + sqlString; 
        console.log(message);        
      })  
                                         
      }) 


    }
    
}

export default EventsGLDatabase;