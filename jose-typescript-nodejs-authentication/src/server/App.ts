import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import SnowdenRouter from './routes/SnowdenRouter';
import EventsGLRouter from './routes/EventsGLRouter';
import TesterRouter from './routes/TesterRouter';
import AuthorizationRouter from './routes/AuthorizationRouter';
import LoginRouter from './routes/LoginRouter';
import * as OAuth2Server from 'express-oauth-server';
import Modeloauth from './Modeloauth';
import AuthenticatedUser from './models/AuthenticatedUser'
import * as google from 'googleapis';
import * as session from 'express-session';
import ScheduleProcessor from './modules/SchedulerProcessor';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  public oauth = new OAuth2Server({
    model: Modeloauth,
    grants: ['password'],
    debug: true
  });


  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.oauth = new OAuth2Server({
      model: require('./Modeloauth'),
      grants: ['password'],
      debug: true
    });
    this.createSuperUser();
    this.createScheduler();
    console.log("Server Started!")
  }

  // Configure Express middleware.
  private middleware(): void {    
    this.express.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://' + process.env.SERVER_NODE + ':' + process.env.PORT_WEB);
      if(process.env.PORT_WEB == "80") {
        res.setHeader('Access-Control-Allow-Origin', 'http://' + process.env.SERVER_NODE);
      }
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
      // Pass to next layer of middleware
      next();
    });
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private createSuperUser(): void {
    //const username = process.env.SUPER_USER || 'gustavo.sanchez@youse.com.br'
    const username = 'gustavo.sanchez@youse.com.br'
    AuthenticatedUser.findOrCreate({where: {username: username}})
    .spread((user, created) => {
      user.update({
        enabled: true
      }).then(() => {})  
    });    

  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();    
    const loginRouter = new LoginRouter(this.oauth);
    const snowdenRouter = new SnowdenRouter(this.oauth);
    const eventsGLRouter = new EventsGLRouter(this.oauth);
      
    let authenticate = this.oauth.authenticate();
    
    this.express.use('/login', loginRouter.router);
    this.express.use('/auth', authenticate,  AuthorizationRouter);
    this.express.use('/snowden', snowdenRouter.router);
    this.express.use('/eventsGL', eventsGLRouter.router);    
    this.express.use('/tester', authenticate, TesterRouter);  
  }

  private createScheduler(): void {
    new ScheduleProcessor().execute();
  }
  
}

export default new App().express;