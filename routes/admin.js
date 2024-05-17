const express = require('express');
const router = express.Router();

// 老師頁面
router.get("/", function (req, res, next) {
  res.render("admin", {title: "admin"});
});

// 備註畫面
router.get("/note", function (req, res, next) {
  res.render("note", {title: "note"});
});

module.exports = router;
