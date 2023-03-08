const { Sequelize } = require("sequelize");

let sequelize;
if (process.env.CLEARDB_OLIVE_URL) {
    sequelize = new Sequelize(
        process.env.CLEARDB_OLIVE_URL,
        {
            dialect: 'mysql',
        },
    );
} else {
    sequelize = new Sequelize(
        process.env.DB_DB,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
        },
    );
}

module.exports = sequelize;