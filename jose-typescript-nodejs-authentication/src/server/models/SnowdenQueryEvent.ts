import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';

export var SnowdenQueryEvent = joseDatabase.sequelize.define('snowdenqueryevent', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  event: { type: Sequelize.STRING },
  queryname: { type: Sequelize.STRING },
  
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});



export default SnowdenQueryEvent;