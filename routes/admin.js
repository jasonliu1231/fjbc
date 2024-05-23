const express = require("express");
const router = express.Router();

// 老師頁面
router.get("/", function (req, res, next) {
    res.render("login", { title: "login" });
});

// 問班頁面
router.get("/askclass", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("askclass", { title: "askclass" });
    } else {
        res.render("mobile_askclass", { title: "askclass" });
    }
});

// 追蹤頁面
router.get("/track", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("track", { title: "track" });
    } else {
        res.render("mobile_track", { title: "track" });
    }
});

// 備註畫面
router.get("/note", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("note", { title: "note" });
    } else {
        res.render("mobile_note", { title: "note" });
    }
});

module.exports = router;
