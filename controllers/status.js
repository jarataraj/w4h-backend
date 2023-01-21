const statusRouter = require("express").Router();
const { adminOnly } = require("../utils/middleware");
const Status = require("../models/status");

// let status = {
//     latestSuccessfulUpdateSource: null,
//     isUpdating: false,
// };

statusRouter.get("/", async (req, res) => {
    const status = await Status.findOne();
    res.json(status);
});

statusRouter.post("/", adminOnly, async (req, res) => {
    let status = await Status.findById("status");
    const update = req.body;
    if (!status) {
        status = new Status({ _id: "status", ...update });
    } else {
        for (let key of Object.keys(update)) {
            status[key] = update[key];
        }
    }
    await status.save();
    res.json(status);

    // const update = Object.entries(req.body).filter(([key]) =>
    //     Object.hasOwn(status, key)
    // );
    // if
    // status = { ...status, ...Object.fromEntries(update) };
    // await status.save;
    // res.json(status);
});

module.exports = statusRouter;
