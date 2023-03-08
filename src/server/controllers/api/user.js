const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require('../../models');

const userRouter = new Router();

userRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
        where: {
            username,
        },
    });

    if (existingUser) {
        res.status(409).end();
        return;
    }

    const newUser = await User.create({
        username,
        password,
    });

    res.status(200).json({
        id: newUser.id,
    });
});

userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
        where: {
            username,
        },
    });

    if (!existingUser) {
        res.status(401).end();
        return;
    }

    if (!bcrypt.compareSync(password, existingUser.password)) {
        res.status(401).end();
        return;
    }

    const token = jwt.sign({
        id: existingUser.id,
    }, process.env.JWT_KEY);

    res.cookie("session_token", token, {
        maxAge: 1000 * 60 * 60 * 5,
    });

    res.status(200).json({
        id: existingUser.id,
    });
});

module.exports = userRouter;