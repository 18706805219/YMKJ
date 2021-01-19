// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入路由处理函数模块
const userHandler = require("../router_handler/userinfo");

// 获取用户信息接口
router.get("/getinfo", userHandler.getinfo);
// 修改用户信息接口
router.post("/editinfo", userHandler.editinfo);
// 修改密码信息接口
router.post("/editpwd", userHandler.editpwd);
// 修改头像接口
router.post("/editavatar", userHandler.editavatar);

// 共享路由
module.exports = router;