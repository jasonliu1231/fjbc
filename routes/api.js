const express = require("express");
const router = express.Router();

// 設定裝置
router.get("/steDevice", function (req, res, next) {
    const isWeb = req.query.isWeb;
    req.session.isWeb = isWeb;
    res.send(isWeb);
});

module.exports = router;
