import {Router, Request, Response, NextFunction} from 'express';
import EventsGLDatabase from '../modules/EventsGLDatabase';
import * as child_process from 'child_process'; 

export class EventsGLRouter { 
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor(oauth) {
    this.router = Router();
    this.init(oauth);
  }
  
  public ping(req: Request, res: Response, next: NextFunction) {            
    res.send("EventsGLRouter - starded");
  }  
  
  public typesEvents(req: Request, res: Response, next: NextFunction) {            
    res.json( [
                  { name: '1101', abbr: '11' },
                  { name: '1101_E', abbr: '11' },
                  { name: '1102', abbr: '11' },
                  { name: '1103', abbr: '11',},
                  { name: '1104', abbr: '11' },
                  { name: '2101', abbr: '21' },
                  { name: '2102', abbr: '21' },
                  { name: '2104', abbr: '21' },
                  { name: '2106', abbr: '21' },
                  { name: '2107', abbr: '21' },
                  { name: '2108', abbr: '21' },
                  { name: '2110', abbr: '21' },
                  { name: '2115', abbr: '21' },
                  { name: '2117', abbr: '21' },
                  { name: '2118', abbr: '21' },
                  { name: '2120', abbr: '21' },
                  { name: '2121', abbr: '21' },
                  { name: '2122', abbr: '21' },
                  { name: '2130', abbr: '21' }
               ]
    );
  }   

  public createEventsGL(req: Request, res: Response, next: NextFunction) {
        
    console.log("Executing Create Events GL..." + JSON.stringify(req.body))
    let eventsGL = new EventsGLDatabase()   
    eventsGL.executeStoredProcedure(req.body).then(outidlote => {            
      console.log('outidlote1:',outidlote);
      return outidlote
    }).then(v => {
      let child = child_process.exec('java -jar ./lib/youse.gw.gl.sap.jar ' +req.body.typeEvent+" "+v.outidlote,
      function (error, stdout, stderr){
          console.log("Output: -> " + stdout);
          if(error !== null){
            console.log('Error ->' + error);         
          }
      });
      module.exports = child;      
      res.json({identifier: v})
    })
  }
  //TODO VERIFY 
  private createFile(req: Request,outidlote: String) {    
      let javaParametersEvent= req.body.data.typeEvent
      let child = child_process.exec('java -jar ./lib/youse.gw.gl.sap.jar ' + javaParametersEvent+" "+outidlote,
      function (error, stdout, stderr){
      console.log("Output: -> " + stdout);
      if(error !== null){
         console.log('Error ->' + error);         
      }
     });
      module.exports = child;
  }


  public createSequenceGL(req: Request, res: Response, next: NextFunction){
    new EventsGLDatabase()
    .executeSequence()
    .then(result => {
      res.send(result);
      console.log('seq',result);    
    })
  }

  public resetSequence(req: Request, res: Response, next: NextFunction){
    new EventsGLDatabase()
    .resetSequence()
    .then(result => {
      res.send("Sequence Restarted!");
      console.log('seq',result);    
    })
  }


   public readLogGL(req: Request, res: Response, next: NextFunction){
    var fs = require('fs');    
      try {
          var data = fs.readFileSync('/var/log/youse-application.log', 'ascii');
          console.log(data);
          res.send(data);
       }
       catch (err) {
          console.error("There was an error opening the file:");
          console.log(err);
          data=err;
          if(err.code=='ENOENT'){
            res.send('File Log not Found in Directory!');
          }else{
            res.send('There was an error opening the file:');
          }
        }
    }

    public createExport(req: Request, res: Response, next: NextFunction) {
      new EventsGLDatabase()
      .filterByDate(req.params.beginDate, req.params.endDate, req.params.eventGL)
      .then(result => {
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        var formatted = dt.format('YmdHMS');
        var fs = require("fs");
        var records=JSON.stringify(result);
        fs.writeFile("/var/Exports/ExportGL"+formatted+".json", JSON.stringify(result, null, 4), (err) => {
          res.send(result); 
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });

      })
    }



  public filterByBeginDate(req: Request, res: Response, next: NextFunction) {
    new EventsGLDatabase()
    .filterByDate(req.params.beginDate, req.params.endDate, req.params.eventGL)
    .then(result => {
      res.send(result);
    })
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init(oauth) {
    this.router.get('/byRange/:beginDate', oauth.authenticate(), this.filterByBeginDate)
    this.router.get('/byRange/:beginDate/:endDate', oauth.authenticate(), this.filterByBeginDate)   
    this.router.post('/createEventsGL', oauth.authenticate(), this.createEventsGL);
    this.router.get('/typesEvents', oauth.authenticate(), this.typesEvents);
    this.router.get('/ping', oauth.authenticate(), this.ping)  
    this.router.get('/byRange/:beginDate/:eventGL',oauth.authenticate(), this.filterByBeginDate)
    this.router.get('/byRange/:beginDate/:endDate/:eventGL',oauth.authenticate(), this.filterByBeginDate)
    this.router.get('/createSequenceGL', oauth.authenticate(), this.createSequenceGL);
    this.router.get('/resetSequence', oauth.authenticate(), this.resetSequence);
    this.router.get('/readLogGL', oauth.authenticate(), this.readLogGL);
    this.router.get('/createExport/:beginDate', oauth.authenticate(), this.createExport);
    this.router.get('/createExport/:beginDate/:endDate', oauth.authenticate(), this.createExport);
    this.router.get('/createExport/:beginDate/:eventGL', oauth.authenticate(), this.createExport);
    this.router.get('/createExport/:beginDate/:endDate/:eventGL', oauth.authenticate(), this.createExport);    
  }

}

export default EventsGLRouter;