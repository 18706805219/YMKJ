// 导入mysql模块
const mysql = require("mysql");
// 创建数据库连接
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '991029',
    database: 'ymkj_db'
});
// 共享数据库连接
module.exports = db;