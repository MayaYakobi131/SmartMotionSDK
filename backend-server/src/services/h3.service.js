const h3 = require("h3-js");

const H3_RESOLUTION = 9;

const convertLocationToH3 = (latitude, longitude) => {
    return h3.latLngToCell(latitude, longitude, H3_RESOLUTION);
};

module.exports = {
    convertLocationToH3
};