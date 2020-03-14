const Sequelize = require("sequelize");
console.log("db required");
module.exports = new Sequelize('push', 'root', '', {
    dialect: 'mariadb',
    dialectOptions: {connectTimeout: 1000}, // mariadb connector option,
    debug:false,
})