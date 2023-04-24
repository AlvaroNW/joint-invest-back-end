import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
});

pool.connect((err) => {
    if (err) {
        console.error("Error connecting to database", err.stack);
    } else {
        console.log("Connected to database");
    }
});

export default pool;