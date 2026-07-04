const { validApiKeys } = require("../config/apiKeys");

const validateApiKey = (apiKey) => {
    if (!apiKey) {
        return {
            isValid: false,
            error: "API key is required"
        };
    }

    const app = validApiKeys.find(
        (item) => item.key === apiKey && item.isActive
    );

    if (!app) {
        return {
            isValid: false,
            error: "Invalid or inactive API key"
        };
    }

    return {
        isValid: true,
        app
    };
};

module.exports = {
    validateApiKey
};