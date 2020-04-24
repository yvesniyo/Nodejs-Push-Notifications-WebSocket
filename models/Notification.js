const Sequelize = require("sequelize");
const sequelizeConnection = require("../database/connection");
class Notification extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: Sequelize.STRING,
        user_id: Sequelize.INTEGER,
        user_type:Sequelize.STRING,
        uuid:Sequelize.STRING,
        title: Sequelize.STRING,
        image: Sequelize.STRING,
        biggestImage: Sequelize.STRING,
        smallImage: Sequelize.STRING,
        msg: Sequelize.TEXT,
        others:{
          defaultValue: null,
          type: Sequelize.TEXT
        },
        createdAt:Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        modelName: "notifications",
        sequelize
      }
    );
  }
}
// let not = Notification.init(sequelizeConnection, Sequelize);
// not.findAll({
//     where: {
//       user_type: "parent"
//     }
// }).then((data)=>{
//     console.log(JSON.stringify(data))
// });

module.exports = Notification.init(sequelizeConnection, Sequelize);