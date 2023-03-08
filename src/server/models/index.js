const User = require("./user");
const Item = require("./item");

Item.belongsTo(User);
User.hasMany(Item);

module.exports = {
    User,
    Item,
};