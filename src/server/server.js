require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const sequelize = require("./config/connection");
const allRouter = require("./controllers");
require("./models");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "client")));
app.use(express.json());
app.use(cookieParser());
app.use(allRouter);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});