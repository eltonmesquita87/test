import {Router, Request, Response, NextFunction} from 'express';
import * as Sequelize from 'sequelize';
import { UserProcessor } from '../modules/UserProcessor';
import * as Session from 'express-session';
import AuthenticatedUser from '../models/AuthenticatedUser';
import UserAccessToken from '../models/UserAccessToken';
import GoogleAPIHandler from '../modules/GoogleAPIHandler';

export class LoginRouter {
  router: Router  

  /**
   * Initialize the HeroRouter
   */
  constructor(oauth) {
    this.router = Router();  
    this.init(oauth);  
  }

  private loginUrl(req: Request, res: Response, next: NextFunction) { 
    console.log("loginURL");
    let url = new GoogleAPIHandler().loginUrl();

    res.send({url: url});
  }

  private login(req, res) {
    let code = req.query.code;
    let token = new GoogleAPIHandler().login(code).then(token => {
      console.log("promised me !" + token);            
      res.send({token: token});
    }) 
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init(oauth) {        
    this.router.get('/', this.loginUrl)
    this.router.get('/oauthCallback', this.login);    
  }

}

// Create the HeroRouter, and export its configured Express.Router

export default LoginRouter;