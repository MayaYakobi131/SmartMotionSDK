const app = require("./app");
const database = require("./services/database.service");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await database.initDatabase();

        app.listen(PORT, () => {
            console.log(`SmartMotion Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();