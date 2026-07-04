const healthCheck = (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "SmartMotion Server is running"
    });
};

module.exports = {
    healthCheck
};