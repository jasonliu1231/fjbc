const express = require("express");
const router = express.Router();

function getENV(req) {
    const env = {
        token: req.session.token,
        name: req.session.name,
        isWeb: JSON.parse(req.session.isWeb || "true"), // 沒有資料預設都是網頁版
        url: {
            api: process.env.apiurl,
            log: process.env.logurl
        },
    };
    return env;
}

// 登入頁面
router.get("/", function (req, res, next) {
    const env = getENV(req);
    res.render("login", {
        ...env,
        title: "login"
    });
});

// 問班列表頁面
router.get("/askclass", function (req, res, next) {
    const env = getENV(req);
    if (!env.token) {
        res.render("login", {
            ...env,
            title: "login"
        });
    } else {
        if (env.isWeb) {
            res.render("askclass", {
                ...env,
                herderHover: {
                    askclass: "opacity-50",
                    track: "",
                    responsibility: ""
                },
                title: "askclass"
            });
        } else {
            res.render("mobile_askclass", {
                ...env,
                herderHover: {
                    askclass: "opacity-50",
                    track: "",
                    responsibility: ""
                },
                title: "askclass"
            });
        }
    }
});

// 追蹤列表頁面
router.get("/track", function (req, res, next) {
    const env = getENV(req);
    if (!env.token) {
        res.render("login", {
            ...env,
            title: "login"
        });
    } else {
        if (env.isWeb) {
            res.render("track", {
                ...env,
                herderHover: {
                    askclass: "",
                    track: "opacity-50",
                    responsibility: ""
                },
                title: "track"
            });
        } else {
            res.render("mobile_track", {
                ...env,
                herderHover: {
                    askclass: "",
                    track: "opacity-50",
                    responsibility: ""
                },
                title: "track"
            });
        }
    }
});

// 問班表查詢畫面
router.get("/note", function (req, res, next) {
    const env = getENV(req);
    if (!env.token) {
        res.render("login", {
            ...env,
            title: "login"
        });
    } else {
        if (env.isWeb) {
            res.render("note", {
                ...env,
                herderHover: {
                    askclass: "opacity-50",
                    track: "",
                    responsibility: ""
                },
                title: "note"
            });
        } else {
            res.render("mobile_note", {
                ...env,
                herderHover: {
                    askclass: "opacity-50",
                    track: "",
                    responsibility: ""
                },
                title: "note"
            });
        }
    }
});

// 主責畫面
router.get("/responsibility", function (req, res, next) {
    const env = getENV(req);
    if (!env.token) {
        res.render("login", {
            ...env,
            title: "login"
        });
    } else {
        if (env.isWeb) {
            res.render("responsibility", {
                ...env,
                herderHover: {
                    askclass: "",
                    track: "",
                    responsibility: "opacity-50"
                },
                title: "responsibility"
            });
        } else {
            res.render("mobile_responsibility", {
                ...env,
                herderHover: {
                    askclass: "",
                    track: "",
                    responsibility: "opacity-50"
                },
                title: "responsibility"
            });
        }
    }
});

module.exports = router;
