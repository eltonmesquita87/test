import {Router, Request, Response, NextFunction} from 'express';
import SnowdenProcessor from '../modules/SnowdenProcessor';
import Snowden from '../models/Snowden';
import Problem from '../models/Problem';
import SnowdenQuery from '../models/SnowdenQuery';
import * as Sequelize from 'sequelize';
import { GuidewireDatabase } from '../modules/GuidewireDatabase';

export class SnowdenRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Heroes.
   */
  public snowden(req: Request, res: Response, next: NextFunction) {            
    new SnowdenProcessor().execute(req.params.policy_number, req.params.env);
    res.send("Snowden was started, will disclose info on slack and database...");
  }

  public filterByBeginDate(req: Request, res: Response, next: NextFunction) {            
    let beginDate = req.params.beginDate
    Snowden.findAll({ 
      where: { started_at: {
        [Sequelize.Op.gte]: beginDate
      }}
    }).then(snowdens => {
      res.send(snowdens);
    })
  }

  public filterByEndDate(req: Request, res: Response, next: NextFunction) {            
    let beginDate = req.params.beginDate
    let endDate = req.params.endDate
    Snowden.findAll({ 
      where: { started_at: {
        [Sequelize.Op.gte]: beginDate,
        [Sequelize.Op.lte]: endDate
      }}
    }).then(snowdens => {
      res.send(snowdens);
    })
    
  }

  private resultsById(req: Request, res: Response, next: NextFunction) {        
    let snowden_id = req.params.id
    Snowden.findAll({
      where: {id: {[Sequelize.Op.eq]: snowden_id }},
      include: [{
        model: SnowdenQuery, 
        include: [{model: Problem, required: true} ]
      }
    ]
    }).then(snowdens => {
      res.send(snowdens);
    })
  }

  private envs(req: Request, res: Response, next: NextFunction) { 
    res.send(new GuidewireDatabase().getEnvs());
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/envs', this.envs)
    this.router.get('/byRange/:beginDate', this.filterByBeginDate)
    this.router.get('/byRange/:beginDate/:endDate', this.filterByEndDate)
    this.router.get('/results/:id', this.resultsById)
    this.router.get('/:policy_number', this.snowden);
    this.router.get('/env/:env', this.snowden);
    this.router.get('/env/:env/:policy_number', this.snowden);
    this.router.get('/', this.snowden);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const snowdenRoutes = new SnowdenRouter();
snowdenRoutes.init();

export default snowdenRoutes.router;