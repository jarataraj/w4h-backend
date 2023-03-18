const statusRouter = require("express").Router();
const { adminOnly } = require("../utils/middleware");
const Status = require("../models/status");
const mongoose = require("mongoose");

const fiveMinMillisec = 5 * 60 * 1000;

const status = {
    _lastUpdated: 0,
    _status: null,
    _error: false,
    get status() {
        const now = Date.now();
        // update if more than 5 min have passed or cache holds error
        if (now - this._lastUpdated > fiveMinMillisec || this._error) {
            this._lastUpdated = now;
            // _status must hold promise since findById is thenable
            this._status = new Promise((resolve, reject) => {
                Status.findById("status").then(
                    (result) => resolve(result),
                    (error) => {
                        this._error = true;
                        reject(error);
                    }
                );
            });
        }
        return this._status;
    },
};

// NOTE: Atlas Serverless does not support change streams
// [source](https://www.mongodb.com/docs/atlas/reference/serverless-instance-limitations/)
// mongoose.connection.asPromise().then(() => {
//     Status.watch().on("change", (data) => {
//         console.log(data);
//     });
// });

statusRouter.get("/", async (req, res) => {
    // await the promise returned by status.status()
    res.json(await status.status);
});

statusRouter.post("/", adminOnly, async (req, res) => {
    let currentStatus = await Status.findById("status");
    const update = req.body;
    if (!currentStatus) {
        currentStatus = new Status({ _id: "status", ...update });
    } else {
        // can't use spread operation. Must update keys of original object
        // in order to use Mongoose's doc.save()
        for (let key of Object.keys(update)) {
            currentStatus[key] = update[key];
        }
    }
    await currentStatus.save();
    res.json(currentStatus);

    // const update = Object.entries(req.body).filter(([key]) =>
    //     Object.hasOwn(status, key)
    // );
    // if
    // status = { ...status, ...Object.fromEntries(update) };
    // await status.save;
    // res.json(status);
});

module.exports = statusRouter;
