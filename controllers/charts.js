const chartsRouter = require("express").Router();
const { adminOnly } = require("../utils/middleware");
const { rm } = require("node:fs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./public/charts",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

chartsRouter.post("/", adminOnly, upload.single("chart"), async (req, res) => {
    res.status(201).end();
});

chartsRouter.delete("/:day", adminOnly, async (req, res, next) => {
    // Q: Better to use synchronous version? Why?
    rm(
        `./public/charts/${req.params.day}`,
        { force: true, maxRetries: 5 },
        (err) => {
            if (err) {
                next(err);
            } else {
                res.status(204).end();
            }
        }
    );
});

module.exports = chartsRouter;
