const { Router } = require("express");

const auth = require("../../middleware/auth");
const { Item } = require('../../models');

const itemRouter = new Router();

itemRouter.post('/', auth, async (req, res) => {
    const { title } = req.body;

    const newItem = await Item.create({
        title,
        UserId: req.user_id,
    });

    res.status(200).json({
        id: newItem.id,
    });
});

itemRouter.get('/foruser', auth, async (req, res) => {
    const items = await Item.findAll({
        where: {
            UserId: req.user_id,
        },
    });

    const plainItems = items.map((item) => item.get({ plain: true }));
    res.status(200).json(plainItems);
});

itemRouter.patch("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const user_id = req.user_id;

    const item = await Item.findByPk(id);
    if (!item) {
        res.status(404).end();
        return;
    }

    if (item.UserId != user_id) {
        res.status(403).end();
        return;
    }

    await Item.update({ title }, {
        where: {
            id,
        },
    });

    res.status(200).json({ id });
});

itemRouter.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user_id;

    const item = await Item.findByPk(id);
    if (!item) {
        res.status(404).end();
        return;
    }

    if (item.UserId != user_id) {
        res.status(403).end();
        return;
    }

    await Item.destroy({
        where: {
            id,
        },
    });

    res.status(200).json({ id });
});

module.exports = itemRouter;