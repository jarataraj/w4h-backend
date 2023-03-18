const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
    _id: String,
    forecastStart: Date,
    tempTimesEncoded: [Number],
});

forecastSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.location = returnedObject._id.toString();
        delete returnedObject._id;
        // delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Forecast", forecastSchema, "forecasts");
