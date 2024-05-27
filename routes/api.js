const express = require("express");
const router = express.Router();

// 設定裝置
router.get("/steDevice", function (req, res, next) {
    const isWeb = req.query.isWeb;
    const token = req.query.token;
    const name = req.query.name;
    req.session.isWeb = isWeb;
    req.session.token = token;
    req.session.name = name;
    res.send(isWeb);
});

module.exports = router;
