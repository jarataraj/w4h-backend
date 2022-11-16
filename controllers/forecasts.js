const forecastsRouter = require("express").Router();
const Forecast = require("../models/forecast");

forecastsRouter.get("/:lat-:lon", async (req, res) => {
    const lat = (Math.round(parseFloat(req.params.lat) * 4) / 4).toFixed(2);
    const lon = (Math.round(parseFloat(req.params.lon) * 4) / 4).toFixed(2);
    const forecast = await Forecast.findById(`${lat},${lon}`);
    if (forecast) {
        res.json(forecast);
    } else {
        res.status(404).end();
    }
});

module.exports = forecastsRouter;
