// 导入数据库连接模块
const db = require("../db/mysql");
// 导入文章类型表单验证
const ckarttype = require("../checkinfo/articletype");
// 导入文章表单验证
const ckarticle = require("../checkinfo/article");
// 导入path模块
const path = require("path");

// 获取文章类型列表的路由处理函数
module.exports.getArtType = (req, res) => {
    /* 
        获取文章类型列表的逻辑:
            1. 导入数据库模块
            2. 定义查询语句
            3. 执行查询语句
            4. 响应数据
    */
    const sql = "SELECT * FROM ym_article_type WHERE isDel = 0";
    db.query(sql, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "获取文章类型列表成功！",
            data: result
        });
    });
}

// 添加文章类型的路由处理函数
module.exports.addArtType = (req, res) => {
    /* 
        添加文章类型的逻辑:
            1. 验证表单数据
            2. 判断添加的文章类型是否存在
            3. 如果存在,判断是否删除
                a. 如果未删除,则响应文章类型已存在
                b. 如果删除,则修改isDel=0
            4. 如果不存在,进行添加
    */
    const err = ckarttype.validate(req.body, ckarttype.schema.addschema);
    if (err) {
        return res.ck(err);
    }
    const sqlgetarttype = "SELECT * FROM ym_article_type WHERE type = ?";
    db.query(sqlgetarttype, req.body.type, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        // 文章类型存在
        if (result.length === 1 && req.body.type === result[0].type) {
            // 未删除
            if (result[0].isDel == 0) {
                return res.ck("该文章类型已存在！");
            } else {
                // 删除了,更改isDel=0
                const sqlupdarttype = "UPDATE ym_article_type SET isDel = 0 WHERE id = ?";
                db.query(sqlupdarttype, result[0].id, (err, results) => {
                    if (err) {
                        return res.ck(err);
                    }
                    if (results.affectedRows !== 1) {
                        return res.ck("添加文章类型失败，请稍后再试！");
                    }
                    return res.ck("添加文章类型成功", 0);
                });
            }
        }
        // 文章类型不存在
        else {
            const sqladdarttype = "INSERT INTO ym_article_type SET ?";
            db.query(sqladdarttype, req.body, (err, result) => {
                if (err) {
                    return res.ck(err);
                }
                if (result.affectedRows !== 1) {
                    return res.ck("添加文章类型失败，请稍后再试！");
                }
                return res.ck("添加文章类型成功！", 0);
            });
        }
    });
}

// 删除文章类型的路由处理函数
module.exports.delArtType = (req, res) => {
    /* 
        删除文章类型逻辑:
            1. 验证表单数据
            2. 定义sql语句
            3. 更新表中的isDel=1
    */
    const err = ckarttype.validate(req.body, ckarttype.schema.delschema);
    if (err) {
        return res.ck(err);
    }
    const sqldelarttype = "UPDATE ym_article_type SET isDel = 1 WHERE id = ?";
    db.query(sqldelarttype, req.body.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("删除文章类型失败，请稍后再试！");
        }
        res.ck("删除文章类型成功！", 0);
    });
}

// 根据id获取文章类型的路由处理函数
module.exports.getArtTypeById = (req, res) => {
    /* 
        获取文章类型逻辑:
            1. 验证表单数据
            2. 根据id查询数据库
            3. 响应数据
    */
    const err = ckarttype.validate(req.query, ckarttype.schema.delschema);
    if (err) {
        return res.ck(err);
    }
    const sql = "SELECT type FROM ym_article_type WHERE id = ?";
    db.query(sql, req.query.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("获取文章类型失败，请稍后再试！");
        }
        res.send({
            status: 0,
            msg: "获取文章类型成功！",
            data: result
        });
    });
}

// 根据id修改文章类型的路由处理函数
module.exports.updArtType = (req, res) => {
    /* 
        1. 验证表单数据
        2. 判断需要修改的类型是否存在
        3. 如果存在
            a. 未删除,则响应该文章类型已存在
            b. 删除,将删除的数据的type设为"",然后修改需要修改的文章类型,最后将删除的数据的type修改为需要修改的数据的原来的type值
        4. 如果不存在,则执行修改操作
    */
    const err = ckarttype.validate(req.body, ckarttype.schema.updschema);
    if (err) {
        return res.ck(err);
    }
    // 获取需要修改的数据的原来的type值
    const sql1 = "SELECT type FROM ym_article_type WHERE id = ?";
    db.query(sql1, req.body.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("该文章分类暂时无法修改！");
        } else {
            const oldtype = result[0].type;
            // 查询修改的类型是否存在
            const sql2 = "SELECT * FROM ym_article_type WHERE type = ?";
            db.query(sql2, req.body.type, (err, result) => {
                if (err) {
                    return res.ck(err);
                }
                // 文章类型存在
                if (result.length === 1 && req.body.type === result[0].type) {
                    const tid = result[0].id;
                    // 判断是否删除
                    if (result[0].isDel == 0) {
                        return res.ck("修改的文章类型已存在！");
                    } else {
                        // 将删除的数据的type改为""
                        const sql3 = "UPDATE ym_article_type SET type = '' WHERE id = ?";
                        db.query(sql3, tid, (err, result) => {
                            if (err) {
                                return res.ck(err);
                            }
                            if (result.affectedRows !== 1) {
                                return res.ck("该分类修改失败！");
                            } else {
                                const sql4 = "UPDATE ym_article_type SET type = ? WHERE id = ?";
                                db.query(sql4, [req.body.type, req.body.id], (err, result) => {
                                    if (err) {
                                        return res.ck(err);
                                    }
                                    if (result.affectedRows !== 1) {
                                        return res.ck("修改文章类型失败，请稍后再试！");
                                    } else {
                                        const sql5 = "UPDATE ym_article_type SET type = ? WHERE id = ?";
                                        db.query(sql5, [oldtype, tid], (err, result) => {
                                            if (err) {
                                                return res.ck(err);
                                            }
                                            if (result.affectedRows !== 1) {
                                                return res.ck("该分类修改失败！");
                                            }
                                            res.ck("修改文章类型成功！", 0);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                // 文章类型不存在
                else {
                    const sql6 = "UPDATE ym_article_type SET type = ? WHERE id = ?";
                    db.query(sql6, [req.body.type, req.body.id], (err, result) => {
                        if (err) {
                            return res.ck(err);
                        }
                        if (result.affectedRows !== 1) {
                            return res.ck("修改文章类型失败，请稍后再试！");
                        }
                        res.ck("修改文章类型成功！", 0);
                    });
                }
            });
        }
    });
}

// 个人发布新文章的路由处理函数
module.exports.addArticle = (req, res) => {
    /* 
        个人发布新文章逻辑:
            1. 使用multer中间件解析FromData格式的数据(解析conpicimage文章封面图片)
            2. 验证是否上传文章封面图片
            3. 验证表单数据
            4. 实现添加新文章功能
    */
    // 验证是否上传文章封面图片
    if (!req.file || req.file.fieldname !== 'conpicimage') {
        return res.ck("未选择封面图片！");
    }
    // 获取表单验证结果
    const err = ckarticle.validate(req.body, ckarticle.schema.addartschema);
    if (err) {
        return res.ck(err);
    }
    const articleInfo = {
        ...req.body,
        author_id: req.user.id,
        publishtime: new Date(),
        conpicimage: path.join("/uploads", req.file.filename),
        status: "未查封"
    };
    const sql = "INSERT INTO ym_article SET ?";
    db.query(sql, articleInfo, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("发布文章失败，请稍后再试！");
        }
        res.ck("发布文章成功！", 0);
    });
}

// 修改个人文章的路由处理函数
module.exports.updArticle = (req, res) => {
    /* 
        修改个人文章逻辑:
            1. 验证表单数据
            2. 判断是否上传了文章封面图片
            3. 实现修改文章功能
    */
    // 验证表单数据
    const err = ckarticle.validate(req.body, ckarticle.schema.updartschema);
    if (err) {
        return res.ck(err);
    }
    var articleInfo = {};
    // 未上传文章封面图片
    if (!req.file || req.file.fieldname !== 'conpicimage') {
        articleInfo = {
            title: req.body.title,
            type_id: req.body.type_id,
            content: req.body.content
        };
    } else {
        articleInfo = {
            title: req.body.title,
            type_id: req.body.type_id,
            content: req.body.content,
            conpicimage: path.join("/uploads", req.file.filename)
        };
    }
    const sql = "UPDATE ym_article SET ? WHERE id = ?";
    db.query(sql, [articleInfo, req.body.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("修改文章失败，请稍后再试！");
        }
        res.ck("修改文章成功！", 0);
    });
}

// 删除个人文章的路由函数
module.exports.delArticle = (req, res) => {
    /*  
        删除个人文章逻辑:
            1. 验证表单数据
            2. 实现删除功能
    */
    const err = ckarticle.validate(req.body, ckarticle.schema.delartschema);
    if (err) {
        return res.ck(err);
    }
    const sql = "UPDATE ym_article SET isDel = 1 WHERE id = ?";
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("删除个人文章失败，请稍后再试！");
        }
        res.ck("删除个人文章成功", 0);
    });
}

// 登陆成功，查看作者自己文章列表
module.exports.getArticle = (req, res) => {
    /* 
        查看作者自己文章列表步骤:
            1. 定义sql语句
            2. 实现获取功能
    */
    const err = ckarticle.validate(req.query, ckarticle.schema.sortordschema);
    if (err) {
        return res.ck(err);
    }
    const sql = `SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE author_id = ? AND isDel = 0 ORDER BY publishtime ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
    db.query(sql, req.user.id, (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "获取个人文章列表成功！",
            data: result
        });
    });
}

// 根据分类查看个人文章列表
module.exports.getArticleByType = (req, res) => {
    /* 
        根据分类查看个人文章列表逻辑:
            1. 验证表单数据
            2. 定义sql语句
            3. 实现查看功能
    */
    const err = ckarticle.validate(req.query, ckarticle.schema.getartschema);
    if (err) {
        return res.ck(err);
    }
    const sql = `SELECT id,author_id,title,type_id,content,conpicimage,publishtime FROM ym_article WHERE isDel = 0 AND type_id = ? AND author_id = ? ORDER BY publishtime ${req.query.sortord} LIMIT ${(req.query.start - 1) * req.query.rows},${req.query.rows}`;
    db.query(sql, [req.query.type_id, req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: "获取个人文章列表成功！",
            data: result
        });
    });
}

