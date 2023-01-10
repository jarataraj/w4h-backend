const statusRouter = require("express").Router();
const { adminOnly } = require("../utils/middleware");

let status = {
    latestSuccessfulUpdateSource: null,
    isUpdating: false,
};

statusRouter.get("/", async (req, res) => {
    res.json(status);
});

statusRouter.post("/", adminOnly, (req, res) => {
    console.log(req.body);
    const update = Object.entries(req.body).filter(([key]) =>
        Object.hasOwn(status, key)
    );
    status = { ...status, ...Object.fromEntries(update) };
    res.json(status);
});

module.exports = statusRouter;
