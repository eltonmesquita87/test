import {Router, Request, Response, NextFunction} from 'express';
import * as Sequelize from 'sequelize';
import { UserProcessor } from '../modules/UserProcessor';

export class AuthorizationRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public registerUser(req, res) {
    new UserProcessor().registerUser(req, res);    
  }  

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/registerUser', this.registerUser)    
  }

}

// Create the HeroRouter, and export its configured Express.Router
const authorizationRouter = new AuthorizationRouter();
authorizationRouter.init();

export default authorizationRouter.router;