// 导入数据库模块
const db = require("../db/mysql");
// 导入表单验证模块
const ckreview = require("../checkinfo/review");

// 添加评论的路由处理函数
module.exports.addReview = (req, res) => {
    /* 
        添加评论的逻辑:
            1. 验证表单数据
            2. 定义sql语句
            3. 实现添加评论功能
    */
    const err = ckreview.validate(req.body, ckreview.schema.addreviewschema);
    if (err) {
        return res.ck(err);
    }
    const adddata = {
        article_id: req.body.article_id,
        content: req.body.content,
        review_time: new Date(),
        review_user: req.user.id
    };
    const sql = "INSERT INTO ym_article_review SET ?";
    db.query(sql, adddata, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("添加评论失败，请稍后再试！");
        }
        res.ck("添加评论成功！", 0);
    });
}

// 删除自己的评论的路由处理函数
module.exports.delReview = (req, res) => {
    /* 
        删除自己的评论的逻辑:
            1. 验证表单数据
            2. 定义sql语句
            3. 实现删除评论功能
    */
    const err = ckreview.validate(req.body, ckreview.schema.delreviewschema);
    if (err) {
        return res.ck(err);
    }
    const sql1 = "SELECT * FROM ym_article_review WHERE id = ?";
    db.query(sql1, req.body.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result[0].review_user !== req.user.id) {
            return res.ck("删除评论失败，请删除自己的评论！");
        } else {
            const sql = "UPDATE ym_article_review SET isDel = 1 WHERE id = ?";
            db.query(sql, req.body.id, (err, result) => {
                if (err) {
                    return res.ck(err);
                }
                if (result.affectedRows !== 1) {
                    return res.ck("删除评论失败，请稍后再试！");
                }
                res.ck("删除评论成功！", 0);
            });
        }
    });
}

// 删除自己文章中的评论的路由处理函数
module.exports.delMyReview = (req, res) => {
    const err = ckreview.validate(req.body, ckreview.schema.delmyreviewschema);
    if (err) {
        return res.ck(err);
    }
    const sql = "UPDATE ym_article_review SET isDel = 1 WHERE id = ?";
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("删除评论失败，请稍后再试！");
        }
        res.ck("删除评论成功！", 0);
    });
}