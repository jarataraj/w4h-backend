# w4h-backend
Node/Express backend for [weatherforhumans.com](https://www.weatherforhumans.com): a site providing forecasts of [Universal Thermal Climate Index](https://utci.lobelia.earth/what-is-utci) (UTCI) and [Wet Bulb Globe Temperature](https://www.weather.gov/news/211009-WBGT) (WBGT) using data from the [Global Forecast System](https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast) (GFS). 

## Some nice features:
- utils/RateLimitedTaskQueue.js provides an easy interface for asynchronous rate-limiting of third-party API requests with a timeout, as used in controllers/search.js for Nominatim geolocation and reverse-geolocation requests
- scalable design where each instance polls the database to maintain a record of the latest data source and global charts available. Frontends poll a status endpoint (seen in controllers/status.js) to stay informed and update when new data is availalbe
