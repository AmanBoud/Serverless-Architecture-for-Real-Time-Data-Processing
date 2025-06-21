const mysql = require("mysql");
require("dotenv").config(); // Load .env variables

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,
    database: "iot_db",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("Connected to IoT database!");
});

module.exports = db;
