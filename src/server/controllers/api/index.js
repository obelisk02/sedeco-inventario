const { Router } = require("express");

const userRouter = require("./user");
const itemRouter = require("./item");

const apiRouter = new Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/item", itemRouter);

module.exports = apiRouter;