// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入路由处理函数模块
const articleHandler = require("../router_handler/article_noidentity");

// 展示全部文章列表的接口
router.get("/article", articleHandler.getArticleAll);

// 根据文章类型展示文章列表的接口
router.get("/getarticle", articleHandler.getArticleAllByType);

// 根据作者id查看文章列表的接口
router.get("/getarticlebyauid", articleHandler.getArticleByAuId);

// 查看文章具体内容的接口
router.get("/getarticlecontent", articleHandler.getArticleContent);

// 共享路由
module.exports = router;