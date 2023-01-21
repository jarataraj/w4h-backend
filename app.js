const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const forecastsRouter = require("./controllers/forecasts");
const chartsRouter = require("./controllers/charts");
const searchRouter = require("./controllers/search");
// const usersRouter = require("./controllers/users");
// const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const statusRouter = require("./controllers/status");
const monitorForNewData = require("./utils/monitorForNewData");

// logger.info("connecting to", config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("build"));
app.use(express.static("public"));
app.use(express.json());
// app.use(middleware.requestLogger);

app.use("/api/forecast", forecastsRouter);
app.use("/api/charts", chartsRouter);
app.use("/api/search", searchRouter);
app.use("/api/status", statusRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// monitorForNewData();

module.exports = app;
