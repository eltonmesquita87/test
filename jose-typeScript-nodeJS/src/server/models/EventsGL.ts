import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';

export var typesEvents = joseDatabase.sequelize.define('typesEventsGL', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },  
  name: {type: Sequelize.STRING},
  abbr: { type: Sequelize.STRING},       
}, {
  freezeTableName: true 
});

export default typesEvents;