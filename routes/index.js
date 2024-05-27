var express = require("express");
var router = express.Router();
const db = require("../controller/connection.js");

// 問班表格
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "index",
        apiurl: process.env.apiurl,
        logurl: process.env.logurl
    });
});

router.get("/webindex", function (req, res, next) {
    res.render("web_index", {
        title: "index",
        apiurl: process.env.apiurl,
        logurl: process.env.logurl
    });
});

router.get("/mobileindex", function (req, res, next) {
    res.render("mobile_index", {
        title: "index",
        apiurl: process.env.apiurl,
        logurl: process.env.logurl
    });
});
module.exports = router;
