require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const initDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS locations (
            id SERIAL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "appId" TEXT NOT NULL,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            "h3Index" TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            "receivedAt" TEXT NOT NULL
        )
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_locations_userId
        ON locations("userId")
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_locations_h3Index
        ON locations("h3Index")
    `);

    console.log("PostgreSQL database connected and initialized.");
};

const run = async (sql, params = []) => {
    const result = await pool.query(sql, params);
    return result;
};

const all = async (sql, params = []) => {
    const result = await pool.query(sql, params);
    return result.rows;
};

const get = async (sql, params = []) => {
    const result = await pool.query(sql, params);
    return result.rows[0];
};

module.exports = {
    pool,
    initDatabase,
    run,
    all,
    get
};