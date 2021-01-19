// 导入数据库模块
const db = require("../db/mysql");
// 导入表单验证模块
const ckreview = require("../checkinfo/review");

// 根据文章展示所有评论的路由处理函数
module.exports.getReview = (req, res) => {
    /* 
        根据文章展示所有评论的逻辑:
            1. 验证表单数据
            2. 定义sql语句
            3. 实现展示所有评论功能
    */
    const err = ckreview.validate(req.query, ckreview.schema.getreviewschema);
    if (err) {
        return res.ck(err);
    }
    const sql = `SELECT id,article_id,content,review_time,review_user FROM ym_article_review WHERE isDel = 0 AND article_id = ? ORDER BY review_time ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
    db.query(sql, req.query.article_id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "展示评论成功！",
            data: result
        });
    });
}