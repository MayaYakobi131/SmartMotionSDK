const locationService = require("../services/location.service");
const { validateLocationData } = require("../utils/locationValidator");
const { validateApiKey } = require("../utils/apiKeyValidator");

const saveLocation = async (req, res) => {
    console.log("POST /location received");
    console.log("Request body:", req.body);

    try {
        const apiKey = req.headers["x-api-key"];
        console.log("API key:", apiKey);

        const apiKeyValidation = validateApiKey(apiKey);

        if (!apiKeyValidation.isValid) {
            console.log("Invalid API key:", apiKeyValidation.error);

            return res.status(401).json({
                success: false,
                error: apiKeyValidation.error
            });
        }

        const locationData = {
            ...req.body,
            appId: apiKeyValidation.app.appId
        };

        console.log("Location data after appId:", locationData);

        const validation = validateLocationData(locationData);

        if (!validation.isValid) {
            console.log("Validation failed:", validation.errors);

            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }

        const savedLocation = await locationService.saveLocation(locationData);

        console.log("Saved location:", savedLocation);

        res.status(201).json({
            success: true,
            message: "Location saved successfully",
            data: savedLocation
        });
    } catch (error) {
        console.error("Failed to save location:", error);

        res.status(500).json({
            success: false,
            error: "Failed to save location",
            details: error.message
        });
    }
};

const getLocations = async (req, res) => {
    try {
        const allLocations = await locationService.getAllLocations();

        res.status(200).json({
            success: true,
            count: allLocations.length,
            data: allLocations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch locations",
            details: error.message
        });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await locationService.getStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch stats",
            details: error.message
        });
    }
};

const getHeatmap = async (req, res) => {
    try {
        const heatmap = await locationService.getHeatmap();

        res.status(200).json({
            success: true,
            count: heatmap.length,
            data: heatmap
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch heatmap",
            details: error.message
        });
    }
};

const getTopAreas = async (req, res) => {
    try {
        const topAreas = await locationService.getTopAreas();

        res.status(200).json({
            success: true,
            count: topAreas.length,
            data: topAreas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch top areas",
            details: error.message
        });
    }
};

const getApps = async (req, res) => {
    try {
        const apps = await locationService.getApps();

        res.status(200).json({
            success: true,
            count: apps.length,
            data: apps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch apps",
            details: error.message
        });
    }
};

module.exports = {
    saveLocation,
    getLocations,
    getStats,
    getHeatmap,
    getTopAreas,
    getApps
};