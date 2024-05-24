const express = require("express");
const router = express.Router();

// 登入頁面
router.get("/", function (req, res, next) {
    res.render("login", { title: "login" });
});

// 問班列表頁面
router.get("/askclass", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("askclass", {
            title: "askclass",
            askclass: "opacity-50",
            track: ""
        });
    } else {
        res.render("mobile_askclass", {
            title: "askclass",
            askclass: "opacity-50",
            track: ""
        });
    }
});

// 追蹤列表頁面
router.get("/track", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("track", {
            title: "track",
            askclass: "",
            track: "opacity-50"
        });
    } else {
        res.render("mobile_track", {
            title: "track",
            askclass: "",
            track: "opacity-50"
        });
    }
});

// 問班表查詢畫面
router.get("/note", function (req, res, next) {
    const isWeb = JSON.parse(req.session.isWeb);
    if (isWeb) {
        res.render("note", {
            title: "note",
            askclass: "opacity-50",
            track: ""
        });
    } else {
        res.render("mobile_note", {
            title: "note",
            askclass: "opacity-50",
            track: ""
        });
    }
});

module.exports = router;
