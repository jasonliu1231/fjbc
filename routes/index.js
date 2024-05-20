var express = require("express");
var router = express.Router();
const db = require("../controller/connection.js");

// 問班表格
router.get("/", function (req, res, next) {
    res.render("index", {title: "index"});
});

// API routes
router.get("/getInfo", function (req, res, next) {
    db.query("SELECT * FROM askacademy", (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error retrieving users");
            return;
        }
        res.json(results);
        console.log(results);
    });
});
module.exports = router;
