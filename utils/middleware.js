const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("Headers: ", request.headers);
    logger.info("---");
    next();
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "MulterError") {
        logger.error("field: ", error.field);
        return response.status(500).send({ error: "upload error" });
    }

    next(error);
};

const adminOnly = (req, res, next) => {
    let auth = req.get("Authorization")?.split(" ");
    if (!auth || auth[0] !== "apikey" || auth[1] === process.env.ADMINKEY) {
        return res.status(401).end();
    }
    next();
};

module.exports = { requestLogger, adminOnly, unknownEndpoint, errorHandler };
