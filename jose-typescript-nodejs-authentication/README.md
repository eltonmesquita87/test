# gw-jose-typescript

> Jose is a microservice in nodejs and Vuetify. Which audit Guidewire database for potential erros. This application can also regenerate GL events.

## Build Setup

``` bash
# install dependencies
npm install --save
 
#create a copy of .env-example and rename it to .env
#Change the variables to your liking
#run this script
./startJoseDev.sh


# Structured Changes on the database

When you need to change structure to database please create a migration. Please follow this example:

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'users',
        'email',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'users',
        'encryptedPassword',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('users', 'email'),
      queryInterface.removeColumn('users', 'encryptedPassword')
    ];
  }
};

Also please read this official documentation:
http://docs.sequelizejs.com/manual/tutorial/migrations.html
