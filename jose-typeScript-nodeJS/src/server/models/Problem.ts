import SnowdenQuery from './SnowdenQuery';
import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';

export var Problem = joseDatabase.sequelize.define('problem', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },  
  policynumber: {type: Sequelize.STRING},
  results: { type: Sequelize.TEXT},     
  /*snowden_query_id: {
    type: Sequelize.INTEGER,
 
    references: {      
      model: SnowdenQuery,       
      key: 'id',       
      deferrable: Sequelize.Deferrable.NOT
    }
  }*/
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

export default Problem;