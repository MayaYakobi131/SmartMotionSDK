const express = require("express");

const router = express.Router();

const {
    saveLocation,
    getLocations,
    getStats,
    getHeatmap,
    getTopAreas,
    getApps
} = require("../controllers/location.controller");

router.post("/location", saveLocation);

router.get("/locations", getLocations);

router.get("/stats", getStats);

router.get("/heatmap", getHeatmap);

router.get("/top-areas", getTopAreas);

router.get("/apps", getApps);

module.exports = router;