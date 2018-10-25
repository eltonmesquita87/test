import joseDatabase from '../modules/joseDatabase';
import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt';
import AuthenticatedUser from './AuthenticatedUser';

export var UserAccessToken = joseDatabase.sequelize.define('useraccesstoken', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		token: { type: Sequelize.STRING, allowNull: false	},
		expiration_date : { type: Sequelize.DATE, defaultValue: Sequelize.NOW }	
}, {
	freezeTableName: true
});

UserAccessToken.belongsTo(AuthenticatedUser);
export default UserAccessToken;