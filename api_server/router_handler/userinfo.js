// 导入数据库模块
const db = require("../db/mysql");
// 导入bcrypt中间件
const bcrypt = require("bcryptjs");

// 获取用户信息路由处理函数
module.exports.getinfo = (req, res) => {
    /* 
        获取用户信息逻辑:
            1. 使用token字符串中的id查询数据库
            2. 是否有该用户信息
            3. 响应数据
    */
    // 定义查询语句
    const sql = "SELECT id,uname,uemail,ulogid,unick,upicimage FROM ym_users WHERE id = ?";
    db.query(sql, [req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("获取信息失败，请稍后再试！");
        }
        res.send({
            status: 0,
            msg: "获取用户信息成功！",
            data: result[0]
        });
    });
}

// 修改用户信息路由处理函数
module.exports.editinfo = (req, res) => {
    /* 
        修改用户信息逻辑:
            1. 验证表单数据
            2. 更新用户信息
    */
    // 获取用户信息
    const userInfo = req.body;
    // 导入修改信息验证模块
    const checkEditInfo = require("../checkinfo/userinfo_edit");
    // 获取验证信息
    const err = checkEditInfo(userInfo);
    if (err) {
        return res.ck(err);
    }
    const sql = "UPDATE ym_users SET ? WHERE id = ?";
    db.query(sql, [userInfo, req.body.id], (err, result1) => {
        if (err) {
            return res.ck(err);
        }
        if (result1.affectedRows !== 1) {
            return res.ck("修改信息失败，请稍后再试！");
        }
        res.ck("修改信息成功！", 0);
    });
}

// 修改密码路由处理函数
module.exports.editpwd = (req, res) => {
    /* 
        修改密码逻辑:
            1.验证表单数据
            2.通过token字符串中的id获取数据库中的密码,和用户输入的旧密码进行判断
            3.根据进行修改密码操作
    */
    // 获取用户信息
    const userInfo = req.body;
    // 导入表单验证模块
    const checkpwd = require("../checkinfo/userpwd_edit");
    // 获取验证信息
    const err = checkpwd(userInfo);
    if (err) {
        return res.ck(err);
    }
    const sqlbyupwd = "SELECT * FROM ym_users WHERE id = ?";
    db.query(sqlbyupwd, [req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("用户不存在！");
        }
        // 判断旧密码和数据库中的密码是否一致
        const comparepwd = bcrypt.compareSync(userInfo.oldupwd, result[0].upwd);
        if (!comparepwd) {
            return res.ck("旧密码错误！");
        }
        // 执行修改密码操作
        const sqleditpwd = "UPDATE ym_users SET upwd = ? WHERE id = ?";
        // 对新密码进行加密
        userInfo.newupwd = bcrypt.hashSync(userInfo.newupwd, 10);
        db.query(sqleditpwd, [userInfo.newupwd, req.user.id], (err, results) => {
            if (err) {
                return res.ck(err);
            }
            if (results.affectedRows !== 1) {
                return res.ck("修改密码失败,请稍后再试！");
            }
            res.ck("修改密码成功！", 0);
        });
    });
}

// 修改头像路由处理函数
module.exports.editavatar = (req, res) => {
    /* 
        修改头像逻辑:
            1.验证表单数据
            2.修改头像信息
    */
    // 获取用户信息
    const userInfo = req.body;
    // 导入验证表单数据模块
    const checkAvatar = require("../checkinfo/useravatar_edit");
    // 获取验证信息
    const err = checkAvatar(userInfo);
    if (err) {
        return res.ck(err);
    }
    const sql = "UPDATE ym_users SET ? WHERE id = ?";
    db.query(sql, [userInfo, req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("修改头像失败,请稍后再试！");
        }
        res.ck("修改头像成功！", 0);
    });
}