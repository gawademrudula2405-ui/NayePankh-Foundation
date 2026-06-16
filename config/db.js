const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#@mrudula@29",
    database: "nayepankh_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed!");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

module.exports = db;