const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class Item extends Model {}

Item.init(
    {
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
    },
);

module.exports = Item;