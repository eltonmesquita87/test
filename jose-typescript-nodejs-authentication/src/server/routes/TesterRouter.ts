import {Router, Request, Response, NextFunction} from 'express';
import TesterProcessor from '../modules/tester/TesterProcessor';

export class TesterRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  private tester() {
    console.log("executing tester...")
    new TesterProcessor().execute();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.tester);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const testerRoutes = new TesterRouter();
testerRoutes.init();

export default testerRoutes.router;