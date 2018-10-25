import joseDatabase from '../modules/joseDatabase';
import UserAccessToken from './UserAccessToken';
import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt';

export const AuthenticatedUser = joseDatabase.sequelize.define('authenticateduser', {
	id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1,50]
		}
	},
	password_digest: {
		type: Sequelize.STRING,
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.VIRTUAL,
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	enabled: {type: Sequelize.BOOLEAN, defaultValue: false }
}, {
	freezeTableName: true,
	indexes: [{unique: true, fields: ['username']}]
});

var createHashPassword = function(user, options) {
	user.password_digest = bcrypt.hashSync(user.get('password'), 10)	
	return user;
}

AuthenticatedUser.prototype.authenticate = function(value) {
	console.log("comparing password" + this.password_digest + " with " + value);
	if (bcrypt.compareSync(value, this.password_digest))
		return this;
	else
		return false;
}

/*AuthenticatedUser.beforeCreate(function(user, options) {
	return createHashPassword(user, options);	
})
AuthenticatedUser.beforeUpdate(function(user, options, callback) {
	return createHashPassword(user, options);
})*/

//AuthenticatedUser.hasMany(UserAccessToken);
export default AuthenticatedUser;