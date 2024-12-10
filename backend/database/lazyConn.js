const sql = require("mssql/msnodesqlv8");

const config = {
    user: "SA",
    password: "amrul123",
    server: "Amrul-Haq\\MSNEWSERVER",
    database: "ChatApp",
    driver: "msnodesqlv8",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        trustedConnection: false,
        enableArithAbort: true, // Recommended for compatibility
        trustServerCertificate: true,
    },
};

let pool;

const getPool = async () => {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log("Connected to the database successfully");
        } catch (err) {
            console.error("Database connection error:", err);
            throw new Error("Failed to connect to the database");
        }
    }
    return pool;
};

module.exports = getPool;
