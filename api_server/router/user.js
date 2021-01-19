// 导入express框架
const express = require("express");
// 创建路由模块
const router = express.Router();
// 导入路由处理函数模块
const userHandler = require("../router_handler/user");

// 注册路由
router.post("/register", userHandler.register);
// 登录路由
router.post("/login", userHandler.login);
// 找回密码路由
router.post("/retrieve", userHandler.retrievePwd);

//共享路由模块
module.exports = router;