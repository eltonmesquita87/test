import Snowden from './Snowden';
import Problem from './Problem';
import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';

export var SnowdenQuery = joseDatabase.sequelize.define('snowdenquery', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  center: { type: Sequelize.STRING },
  query_name: { type: Sequelize.STRING },
  started_at : { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  ended_at: { type: Sequelize.DATE},
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

//SnowdenQuery.hasOne(Snowden);
SnowdenQuery.hasMany(Problem);

export default SnowdenQuery;