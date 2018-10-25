import * as schedule from 'node-schedule';
import SnowdenProcessor from './SnowdenProcessor';
import EventsGLDatabase from './EventsGLDatabase';
import Slacker from './Slacker';
import {config} from 'node-config-ts';

export class ScheduleProcessor {
  
  constructor() {

  }

  public execute(): void {
    this.runSnowden();
    this.runResetSequence();
    this.runNotifyGL();
  } 

  private runSnowden(): void {
    let scheduleTime = process.env.SCHEDULER_SNOWDEN || '30 8-18 * * 0-5';    
    let scheduleTimeFechamento = process.env.SCHEDULER_SNOWDEN_FECHAMENTO || '50 20-23 25-31 * *';

    schedule.scheduleJob(scheduleTime , function() {
      console.log("Executing batch Snowden");
      new SnowdenProcessor().execute();
    });

    schedule.scheduleJob(scheduleTimeFechamento , function() {	
        console.log("Executing batch Snowden");	
        new SnowdenProcessor().execute();	
    });
  }

  private runResetSequence(): void {
    let scheduleTime = process.env.SCHEDULER_RESET_SEQUENCE || '1 0 1 * *';

    schedule.scheduleJob(scheduleTime , function() {
      console.log("Executing batch Reset Sequence");
      new EventsGLDatabase()
      .resetSequence()
      .then(result => {      
        console.log('seq',result);    
      })
    });
    
  }

  private runNotifyGL(): void {
    let scheduleTime = process.env.SCHEDULER_GL || '*/15 * * * *';
    schedule.scheduleJob(scheduleTime , function() {
      console.log("Executing batch Notify GL");
      const message = 'ATENÇÃO - Arquivo GL Não Foi Gerado Devido Erro Abaixo:'
      new EventsGLDatabase()
      .findErrorGL()
      .then(result => {  
        result.forEach(querys =>{ 
          new Slacker().postMessage(message ,querys);
          new Slacker().postMessage(message ,querys,config.slack.channel_gl);
          console.log(result);    
        })
       })
    });
    
  }

  
}

export default ScheduleProcessor;