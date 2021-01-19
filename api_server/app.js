// 导入express框架
const express = require("express");
// 创建服务器
const app = express();
// 导入cors中间件,解决跨域问题
const cors = require("cors");
// 导入path模块
const path = require("path");

// 导入用户登录和注册路由模块
const userRouter = require("./router/user");
// 导入用户信息路由模块
const userInfoRouter = require("./router/userinfo");
// 导入文章路由模块
const articleRouter = require("./router/article");
// 导入文章路由模块
const articleRouterNoId = require("./router/article_noidentity");
// 导入文章评论模块(无身份认证)
const reviewRouterNoId = require("./router/article_review_noidentity");
// 导入文章评论模块
const reviewRouter = require("./router/article_review");

// 使用cors中间件
app.use(cors());
// 使用express中的内置中间件解析表单数据
app.use(express.urlencoded({
    extended: false 
}));
// 静态托管uploads文件夹到/upload下
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
// 响应数据中间件
app.use((req, res, next) => {
    res.ck = (err, status = 1) => {
        res.send({
            status: status,
            msg: (err instanceof Error) ? err.message : err
        });
    };
    next();
});

// 导入解析token字符串中间件
const express_jwt = require("express-jwt");
// 导入config.js模块
const config = require("./config");
// 配置解析token字符串中间件
app.use(express_jwt({
    secret: config.secretKey,
    algorithms: ['HS256']
}).unless({
    path: [/^\/api\//,/^\/articlenoid\//,/^\/reviewnoid\//]
}));


// 匹配用户登录和注册模块路由
app.use("/api", userRouter);
// 匹配用户信息模块路由
app.use("/info", userInfoRouter);
// 匹配文章模块路由
app.use("/info/article", articleRouter);
// 匹配不需要身份验证的文章模块路由
app.use("/articlenoid", articleRouterNoId);
// 匹配文章评论路由(无身份认证)
app.use("/reviewnoid", reviewRouterNoId);
// 匹配文章评论路由(有身份认证)
app.use("/review", reviewRouter);

// 错误级中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.ck("无效的token字符串");
    }
});

// 开启服务器
app.listen(8021, "192.168.230.1", () => {
    console.log("服务器正常开启!访问http://192.168.230.1:8021");
});