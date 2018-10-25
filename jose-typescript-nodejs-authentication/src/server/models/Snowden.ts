import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';
import * as Promise from 'bluebird';
import SnowdenQuery from '../models/SnowdenQuery';
import Problem from './Problem';

export var Snowden = joseDatabase.sequelize.define('snowden', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  started_at : { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  policy_number: { type: Sequelize.STRING},
  ended_at: { type: Sequelize.DATE},  
  problems_found: { type: Sequelize.INTEGER},     
  environment: {type: Sequelize.STRING}
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});


Snowden.hasMany(SnowdenQuery);
export default Snowden;