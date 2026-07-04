const validateLocationData = (locationData) => {
    const errors = [];

    if (!locationData.userId) {
        errors.push("userId is required");
    }

    if (locationData.latitude === undefined) {
        errors.push("latitude is required");
    }

    if (locationData.longitude === undefined) {
        errors.push("longitude is required");
    }

    if (!locationData.timestamp) {
        errors.push("timestamp is required");
    }

    if (
        locationData.latitude !== undefined &&
        (typeof locationData.latitude !== "number" ||
            locationData.latitude < -90 ||
            locationData.latitude > 90)
    ) {
        errors.push("latitude must be a number between -90 and 90");
    }

    if (
        locationData.longitude !== undefined &&
        (typeof locationData.longitude !== "number" ||
            locationData.longitude < -180 ||
            locationData.longitude > 180)
    ) {
        errors.push("longitude must be a number between -180 and 180");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateLocationData
};