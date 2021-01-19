// 导入bcryptjs中间件
const bcrypt = require("bcryptjs");
// 导入jsonwebtoken中间件
const jwt = require("jsonwebtoken");
// 导入config.js模块
const config = require("../config");
// 导入数据库模块
const db = require("../db/mysql");

// 注册模块路由处理函数
module.exports.register = (req, res) => {
    /*
        注册逻辑:
            1. 检验用户提交的表单数据是否合法
            2. 检测用户提交的账号是否被占用
            3. 对密码进行加密处理
            4. 向数据库中添加信息
    */
    // 获取用户信息
    const userInfo = req.body;
    // 导入注册用户信息校验
    const checkInfo = require("../checkinfo/user");
    // 检验用户提交的表单数据是否合法
    // 使用@hapi/joi第三方包进行校验
    // 获取检验结果
    const err = checkInfo(userInfo);
    if (err) {
        return res.ck(err);
    }
    // 检验用户信息合法,判断用户名和账号是否被占用

    // 判断用户名是否被占用
    // 导入数据库模块
    const db = require("../db/mysql");
    // 定义用户名查询语句
    const sqlbyname = "SELECT * FROM ym_users WHERE uname=?";
    db.query(sqlbyname, [userInfo.uname], (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.length > 0) {
            return res.ck("该用户名已经被占用，请使用其他用户名！");
        }
        // 判断账号是否被占用
        // 定义账号查询语句
        const sqlbylogid = "SELECT * FROM ym_users WHERE ulogid=?";
        db.query(sqlbylogid, [userInfo.ulogid], (err, result) => {
            if (err) {
                return res.ck(err);
            }
            if (result.length > 0) {
                return res.ck("该账号已经被占用，请使用其他账号！");
            }
            // 用户名和密码都没被占用,则对密码进行加密
            userInfo.upwd = bcrypt.hashSync(userInfo.upwd, 10);
            // 向数据库中添加新用户信息
            const sql = "INSERT INTO ym_users SET ?";
            db.query(sql, {
                uname: userInfo.uname,
                uemail: userInfo.uemail,
                ulogid: userInfo.ulogid,
                upwd: userInfo.upwd
            }, (err, result1) => {
                if (err) {
                    return res.ck(err);
                }
                if (result1.affectedRows !== 1) {
                    return res.ck("注册用户失败，请稍后再试！");
                }
                res.ck("注册成功", 0);
            });
        });
    });
}

// 登录模块路由处理函数
module.exports.login = (req, res) => {
    /*
        登录逻辑:
            1. 检验账号和密码是否合法
            2. 检查账号是否存在
            3. 检查密码是否正确
            4. 向客户端发送token字符串
            5. 配置解析token字符串中间件
    */
    const userInfo = req.body;
    // 导入校验模块
    const checkLogin = require("../checkinfo/userlog");
    // 获取校验结果
    const err = checkLogin(userInfo);
    if (err) {
        return res.ck(err);
    }
    // 判断账号是否存在
    const sql = "SELECT * FROM ym_users WHERE ulogid = ?";
    db.query(sql, [userInfo.ulogid], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("登陆失败，登录账号不存在！");
        }
        // 判断密码是否正确
        // 获取明文密码和数据库中的密码是否相同
        const compareResult = bcrypt.compareSync(userInfo.upwd, result[0].upwd);
        if (!compareResult) {
            return res.ck("登陆失败，登录密码错误！");
        }
        // 向客户端发送token字符串
        // 需要写入token中的数据,一定不能传密码和头像
        const userStr = {
            ...result[0],
            upwd: '',
            upicimage : ''
        };
        // 设置token字符串
        const tokenStr = jwt.sign(userStr, config.secretKey, {
            expiresIn: '24h'
        });
        // 响应token字符串
        res.send({
            status: 0,
            msg: "登陆成功！",
            token: tokenStr
        });
    });
}

// 找回密码模块路由处理函数
module.exports.retrievePwd = (req, res) => {
    /* 
        找回密码逻辑:
            1. 验证账号格式
            2. 判断账号是否存在
            3. 验证邮箱格式
            4. 判断邮箱是否和账号对应
            5. 若对应,则向邮箱发送验证码
            6. 将六位验证码以session形式保存
            7. 
    */
}