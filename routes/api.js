const express = require("express");
const router = express.Router();
const db = require("../controller/connection.js");

router.post("/keywordAskacademy", async function (req, res, next) {
    const { dateStatr, dateEnd, keyword } = req.body;
    let sql = `SELECT askacademy.id, askacademy.created_at, askacademy.student_name, askacademy.school, askacademy.tel, askacademy.mother_mobile, askacademy.father_mobile, askacademy.holiday_time, askacademy.Weekday_time, GROUP_CONCAT(courseselection.course_name) as groupcourseselection FROM askacademy`
    sql += ` LEFT JOIN askacademycourseselectionlink ON askacademy.id = askacademycourseselectionlink.ask_academy_id`
    sql += ` LEFT JOIN courseselection ON askacademycourseselectionlink.course_selection_id = courseselection.id`
    sql += ` WHERE askacademy.created_at >= ? AND askacademy.created_at <= ?`;
    if (keyword !== "") {
        sql += ` AND (askacademy.student_name = ? OR askacademy.mother_name = ? OR askacademy.father_name = ? OR askacademy.school = ?)`;
    }
    sql += ` GROUP BY askacademy.id`;
    sql += ` ORDER BY askacademy.created_at DESC`;
    let params = [dateStatr, dateEnd, keyword, keyword, keyword, keyword];

    db.query(sql, params, (error, results, fields) => {
        if (error) {
            console.error("Error executing query:", error);
            return;
        }
        res.json(results);
    });
});

module.exports = router;
