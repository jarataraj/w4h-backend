const searchRouter = require("express").Router();
const axios = require("axios");
const tz = require("geo-tz");
const Forecast = require("../models/forecast");
const determineForecastId = require("../utils/determineForecastId");
const RateLimitedTaskQueue = require("../utils/RateLimitedTaskQueue");

const nominatimRequests = new RateLimitedTaskQueue(1001, 5000);

const getForecastLocation = (location) => {
    const originalName = location["display_name"]?.split(",");
    const { lat, lon } = location;
    const timeZone = tz.find(lat, lon)[0];
    const forecastId = determineForecastId(lat, lon);
    // ENHANCEMENT: only use state abbreviations for certain countries such
    // as the US, Canada, Australia. Use country abbreviations for small
    // countries like France, Spain, etc.
    let name;
    if (originalName) {
        name =
            location.address.village ||
            location.address.town ||
            location.address.city ||
            originalName[0];
        if (location.address.state) {
            name =
                name + ", " + location.address["ISO3166-2-lvl4"].split("-")[1];
        } else if (location.address.country) {
            name = name + ", " + location.address.country;
        } else if (originalName[1]) {
            name = name + ", " + originalName[1];
        }
    } else {
        let latitude = Math.round(parseFloat(lat) * 4) / 4;
        let longitude =
            ((Math.round(parseFloat(lon) * 4) / 4 + 180) % 360) - 180;
        latitude =
            latitude < 0
                ? `${Math.abs(latitude).toFixed(2)}S`
                : `${latitude.toFixed(2)}N`;
        longitude =
            longitude < 0
                ? `${Math.abs(longitude).toFixed(2)}W`
                : `${longitude.toFixed(2)}E`;
        name = `${latitude}, ${longitude}`;
    }
    let forecastLocation = { name, lat, lon, timeZone, forecastId };
    // Create map link if able
    if (location["osm_id"] && location["osm_type"]) {
        forecastLocation.link = `https://www.openstreetmap.org/${location.osm_type}/${location.osm_id}`;
    }
    return forecastLocation;
};

const geolocation = axios.create({
    baseURL: "https://nominatim.openstreetmap.org",
});

const geolocate = async (location) => {
    const params = {
        q: location,
        email: "admin@weatherforhumans.com",
        format: "jsonv2",
        limit: 1,
        addressdetails: 1,
    };
    const res = await nominatimRequests.enqueue(() =>
        geolocation.get("/search?", { params })
    );
    return res.data.length ? res.data[0] : {};
};

const reverseGeolocate = async (lat, lon) => {
    const params = {
        lat: lat,
        // lon must be in the range [-180,180] for nominatim
        lon: ((parseFloat(lon) + 180) % 360) - 180,
        email: "admin@weatherforhumans.com",
        format: "jsonv2",
        zoom: 15,
        addressdetails: 1,
    };
    const res = await nominatimRequests.enqueue(() =>
        geolocation.get("/reverse?", { params })
    );
    if (res.data.error) {
        return { lat, lon };
    }
    return res.data;
};

searchRouter.get("/", async (req, res) => {
    let rawLocation;
    if (req.query.location) {
        rawLocation = await geolocate(req.query.location);
    } else if (req.query.lat && req.query.lon) {
        rawLocation = await reverseGeolocate(req.query.lat, req.query.lon);
    } else {
        return res.status(400).end();
    }

    if (!(rawLocation.lat && rawLocation.lon)) {
        return res.status(404).json({ message: "Try a different search" });
    }
    console.log("rawLocation: ", rawLocation);
    const location = getForecastLocation(rawLocation);
    const forecast = await Forecast.findById(location.forecastId);

    if (!forecast) {
        return res
            .status(404)
            .json({ error: `No forecast for ${location.name}` });
    }
    return res.json({ location, forecast });
});

module.exports = searchRouter;
