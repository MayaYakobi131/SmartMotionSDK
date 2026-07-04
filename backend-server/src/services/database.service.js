const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../smartmotion.db");

console.log("Database path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite database connected.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            appId TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            h3Index TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            receivedAt TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_locations_userId
        ON locations(userId)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_locations_h3Index
        ON locations(h3Index)
    `);
});

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = {
    db,
    run,
    all,
    get
};