require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const CHECK_FOR_NEW_DATA_URL = process.env.CHECK_FOR_NEW_DATA_URL;

module.exports = { PORT, MONGODB_URI, ADMIN_API_KEY, CHECK_FOR_NEW_DATA_URL };
