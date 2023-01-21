const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    _id: String,
    isUpdating: Boolean,
    latestSuccessfulUpdateSource: String,
});

statusSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Status", statusSchema, "status");
