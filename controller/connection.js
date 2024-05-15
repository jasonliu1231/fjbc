const mysql = require("mysql");

// 创建数据库连接
const connection = mysql.createConnection({
    host: "172.16.150.23", // 数据库主机地址
    port: "3306",
    user: "kevin", // 数据库用户名
    password: "kevin0704", // 数据库密码
    database: "fjbc" // 数据库名称
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err.stack);
        return;
    }
    console.log("Connected to database as ID", connection.threadId);
});

// 在程序退出时关闭数据库连接
process.on("SIGINT", () => {
    connection.end();
    process.exit();
});

// 导出数据库连接对象，以便其他模块可以使用它
module.exports = connection;
