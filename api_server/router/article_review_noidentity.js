// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入路由处理函数
const reviewHandler = require("../router_handler/article_review_noidentity");

// 根据文章展示所有评论的接口
router.get("/getreview", reviewHandler.getReview);

module.exports = router;