const { Router } = require("express");

const apiRouter = require("./api");

const allRouter = new Router();

allRouter.use("/api", apiRouter);

module.exports = allRouter;