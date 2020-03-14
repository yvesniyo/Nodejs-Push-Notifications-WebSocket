const Sequelize = require("sequelize");
const sequelizeConnection = require("../database/connection");
class UserTypes extends Sequelize.Model {
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
            type: Sequelize.TEXT
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        modelName: "users_types",
        sequelize
      }
    );
  }
}

module.exports = UserTypes.init(sequelizeConnection, Sequelize);