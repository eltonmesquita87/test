import {config} from 'node-config-ts';
import * as Sequelize from 'sequelize';

export class joseDatabase {

  static sequelize = new Sequelize(config.database_url);
  
  public static get Sequelize(): Sequelize {
    return this.sequelize;
  }  

}



export default joseDatabase;