// 导入数据库模块
const db = require("../db/mysql");
// 导入表单验证模块
const ckarticle = require("../checkinfo/article");

// 展示全部文章列表的路由处理函数
module.exports.getArticleAll = (req, res) => {
    const err = ckarticle.validate(req.query, ckarticle.schema.sortordschema);
    if (err) {
        return res.ck(err);
    }
    const sql = `SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE isDel = 0 ORDER BY publishtime ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "展示全部文章列表成功！",
            data: result
        });
    });
}

// 根据文章分类展示文章的路由处理函数
module.exports.getArticleAllByType = (req, res) => {
    const err = ckarticle.validate(req.query, ckarticle.schema.getartschema);
    if (err) {
        return res.ck(err);
    }
    const sql = `SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE isDel = 0 AND type_id = ? ORDER BY publishtime ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
    db.query(sql, req.query.type_id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "展示文章列表成功！",
            data: result
        });
    });
}

// 根据作者id查看文章列表的路由处理函数
module.exports.getArticleByAuId = (req, res) => {
    const err = ckarticle.validate(req.query, ckarticle.schema.getartauidschema);
    if (err) {
        return res.ck(err);
    }
    const sql1 = "SELECT * FROM ym_users WHERE id = ?";
    db.query(sql1, req.query.author_id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("该作者不存在！");
        }
        const sql = `SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE isDel = 0 AND author_id = ? ORDER BY publishtime ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
        db.query(sql, req.query.author_id, (err, result) => {
            if (err) {
                return res.ck(err);
            }
            res.send({
                status: 0,
                msg: "查看文章列表成功！",
                data: result
            });
        });
    });
}

// 查看文章具体内容的路由处理函数
module.exports.getArticleContent = (req, res) => {
    const err = ckarticle.validate(req.query, ckarticle.schema.getartcontschema);
    if (err) {
        return res.ck(err);
    }
    const sql = "SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE isDel = 0 AND id = ?";
    db.query(sql, req.query.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "获取文章具体内容成功！",
            data: result
        });
    });
}