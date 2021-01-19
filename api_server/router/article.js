// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入路由处理函数
const articleHandler = require("../router_handler/article");
// 导入multer中间件
const multer = require("multer");
// 导入path模块
const path = require("path");
// 配置中间件(上传文件的储存路径)
const upload = multer({dest: path.join(__dirname, "../uploads")});

// 获取文章类型列表的接口
router.get("/arttype", articleHandler.getArtType);
// 添加文章类型的接口
router.post("/addarttype", articleHandler.addArtType);
// 删除文章类型的接口
router.post("/delarttype", articleHandler.delArtType);
// 根据id获取文章类型的接口
router.get("/getarttype", articleHandler.getArtTypeById);
// 根据id修改文章类型的接口
router.post("/updarttype", articleHandler.updArtType);
// 个人发布新文章的接口
// upload.single("文件"): 将需要的文件挂载到req.file,其他数据挂载到req.body
router.post("/addarticle", upload.single('conpicimage'), articleHandler.addArticle);
// 修改个人文章的接口
router.post("/updarticle", upload.single('conpicimage'), articleHandler.updArticle);
// 删除个人文章的接口
router.post("/delarticle", articleHandler.delArticle);
// 登录成功,查看作者自己的文章列表的接口
router.get("/getarticle", articleHandler.getArticle);
// 根据文章分类查看个人文章列表
router.get("/getartbytype", articleHandler.getArticleByType);

module.exports = router;