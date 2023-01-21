const axios = require("axios");
const Status = require("../models/status");
const config = require("./config");

const tenMinutes = 10 * 60 * 1000;

function monitorForNewData() {
    async function triggerDataCheck() {
        const status = await Status.findById("status");
        if (!status.isUpdating) {
            console.log("triggering check for new data");
            const response = await axios.post(
                config.CHECK_FOR_NEW_DATA_URL,
                status
            );
            console.log(response.data);
        }
    }
    triggerDataCheck();
    setInterval(() => {
        triggerDataCheck();
    }, tenMinutes);
}

module.exports = monitorForNewData;
