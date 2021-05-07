const mysql = require("mysql");
const config = require("./config");

const conn = mysql.createConnection(config);
conn.connect((err) => {
    if (err) {
        console.log("Error connecting to DB.");
        return;
    }
});