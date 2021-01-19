// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入路由处理函数
const reviewHandler = require("../router_handler/article_review");

// 添加评论的接口
router.post("/addreview", reviewHandler.addReview);

// 删除自己的评论的接口
router.post("/delreview", reviewHandler.delReview);

// 删除自己文章中的评论的接口
router.post("/delmyreview", reviewHandler.delMyReview);

module.exports = router;