const stateRouter = require("express").Router();
const { adminOnly } = require("../utils/middleware");

let state = {
    latestSuccessfulUpdateSource: null,
    isUpdating: false,
};

stateRouter.get("/", async (req, res) => {
    res.json(state);
});

stateRouter.post("/", adminOnly, (req, res) => {
    console.log(req.body);
    const update = Object.entries(req.body).filter(([key]) =>
        Object.hasOwn(state, key)
    );
    state = { ...state, ...Object.fromEntries(update) };
    res.json(state);
});

module.exports = stateRouter;
