import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import SnowdenRouter from './routes/SnowdenRouter';
import EventsGLRouter from './routes/EventsGLRouter';


// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + process.env.PORT_WEB);
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Pass to next layer of middleware
      next();
    });
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!!'
      });
    });
    this.express.use('/', router);
    this.express.use('/snowden', SnowdenRouter);
    this.express.use('/eventsGL', EventsGLRouter);    
    //this.express.use('/snowden/:policy_number', SnowdenRouter);
    //this.express.use('/snowden/byRange/:beginDate', SnowdenRouter);
    //this.express.use('/snowden/byRange/:beginDate/:endDate', SnowdenRouter);
  }

}

export default new App().express;