const Sequelize = require("sequelize");
const sequelizeConnection = require("../database/connection");
class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        status: {
            type:Sequelize.INTEGER,
            defaultValue: 1,
        },
        name: {
            defaultValue: null,
            type: Sequelize.STRING
        },
        user_type_id: Sequelize.INTEGER,
        user_outside_id : {
          type: Sequelize.INTEGER,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        modelName: "users",
        sequelize
      }
    );
  }
}

module.exports = User.init(sequelizeConnection, Sequelize);