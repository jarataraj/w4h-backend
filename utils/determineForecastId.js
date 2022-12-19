const determineForecastId = (lat, lon) => {
    const latitude = (Math.round(parseFloat(lat) * 4) / 4).toFixed(2);
    const longitude = (
        (Math.round(parseFloat(lon) * 4) / 4 + 360) %
        360
    ).toFixed(2);
    return `${latitude},${longitude}`;
};

module.exports = determineForecastId;
