const database = require("./database.service");
const { convertLocationToH3 } = require("./h3.service");

const ACTIVE_USER_WINDOW_MINUTES = 5;

const saveLocation = async (locationData) => {
    const h3Index = convertLocationToH3(
        locationData.latitude,
        locationData.longitude
    );

    const receivedAt = new Date().toISOString();

    const result = await database.run(
        `
        INSERT INTO locations (
            "userId",
            "appId",
            latitude,
            longitude,
            "h3Index",
            timestamp,
            "receivedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `,
        [
            locationData.userId,
            locationData.appId,
            locationData.latitude,
            locationData.longitude,
            h3Index,
            locationData.timestamp,
            receivedAt
        ]
    );

    return {
        id: `live_${locationData.userId}`,
        eventId: result.rows[0].id,
        ...locationData,
        h3Index,
        updatedAt: receivedAt
    };
};

const getAllLocations = async () => {
    const rows = await database.all(
        `
        SELECT l1.*
        FROM locations l1
        INNER JOIN (
            SELECT "userId", MAX(id) AS "latestId"
            FROM locations
            GROUP BY "userId"
        ) l2
        ON l1."userId" = l2."userId" AND l1.id = l2."latestId"
        WHERE l1."receivedAt" >= NOW() - INTERVAL '${ACTIVE_USER_WINDOW_MINUTES} minutes'
        ORDER BY l1."receivedAt" DESC
        `
    );

    return rows.map((row) => ({
        id: `live_${row.userId}`,
        eventId: row.id,
        userId: row.userId,
        appId: row.appId,
        latitude: row.latitude,
        longitude: row.longitude,
        timestamp: row.timestamp,
        h3Index: row.h3Index,
        receivedAt: row.receivedAt,
        updatedAt: row.receivedAt
    }));
};

const getStats = async () => {
    const liveLocations = await getAllLocations();

    const historyRow = await database.get(`
        SELECT COUNT(*)::int AS total
        FROM locations
    `);

    const uniqueUsers = new Set(
        liveLocations.map((location) => location.userId)
    );

    const uniqueAreas = new Set(
        liveLocations.map((location) => location.h3Index)
    );

    return {
        totalLocations: liveLocations.length,
        activeUsers: uniqueUsers.size,
        activeAreas: uniqueAreas.size,
        totalEventsHistory: historyRow?.total || 0
    };
};

const buildHeatmap = async () => {
    const areaMap = {};

    const addLocationToArea = (location, source = "real") => {
        const h3Index = location.h3Index || convertLocationToH3(
            location.latitude,
            location.longitude
        );

        if (!areaMap[h3Index]) {
            areaMap[h3Index] = {
                h3Index,
                count: 0,
                latitudeSum: 0,
                longitudeSum: 0,
                points: 0,
                source
            };
        }

        areaMap[h3Index].count += 1;
        areaMap[h3Index].latitudeSum += Number(location.latitude);
        areaMap[h3Index].longitudeSum += Number(location.longitude);
        areaMap[h3Index].points += 1;
    };

    const liveLocations = await getAllLocations();

    liveLocations.forEach((location) => {
        addLocationToArea(location, "real");
    });

    return Object.values(areaMap).map((area) => ({
        h3Index: area.h3Index,
        count: area.count,
        latitude: area.latitudeSum / area.points,
        longitude: area.longitudeSum / area.points,
        source: area.source
    }));
};

const getHeatmap = async () => {
    return buildHeatmap();
};

const getTopAreas = async () => {
    const heatmap = await getHeatmap();

    return heatmap
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
};

const getApps = async () => {
    const liveLocations = await getAllLocations();
    const apps = {};

    liveLocations.forEach((location) => {
        if (!apps[location.appId]) {
            apps[location.appId] = {
                appId: location.appId,
                totalLocations: 0,
                status: "Active"
            };
        }

        apps[location.appId].totalLocations++;
    });

    return Object.values(apps);
};

module.exports = {
    saveLocation,
    getAllLocations,
    getStats,
    getHeatmap,
    getTopAreas,
    getApps
};