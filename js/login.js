$(function () {
    // 点击注册账号跳转到注册账号界面
    $(".link-reg").on("click", function () {
        $(".reg-box").stop().show().siblings("div").stop().hide();
        $("input").val("");
    });
    // 点击登录跳转到登录界面
    $(".link-login").on("click", function () {
        $(".login-box").stop().show().siblings("div").stop().hide();
        $("input").val("");
    });
    // 验证表单数据(使用layui框架中的form模块)
    var form = layui.form;
    form.verify({
        uid: [
            /^[a-zA-Z0-9]{6,11}$/,
            '账号为6-11位数字、字母或者数字字母的组合'
        ],
        upwd: [
            /^[\S]{6,18}$/,
            '密码长度为6-18位,不能使用空格'
        ]
    });
    // 去除form表单默认事件
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
    });
    // 登录逻辑
    $(".login-btn").on("click", function () {
        // 创建formdata对象
        const formdata = new FormData($(".login-box .layui-form")[0]);
        const url = "http://192.168.230.1:8021/api/login";
        const data = {
            "ulogid": formdata.get("uid"),
            "upwd": formdata.get("upwd")
        };
        // 调用登陆接口
        $.post(
            url,
            data,
            (res) => {
                if (res.status !== 0) {
                    return alert(res.msg);
                }
                alert(res.msg);
                // 本地存储对象
                const storage = window.localStorage;
                // 将token字符串添加到本地存储
                storage.setItem("user", res.token);
            }
        );
    });
    // 注册逻辑
    $(".reg-btn").on("click", function () {
        // 创建formdata对象
        const formdata = new FormData($(".reg-box .layui-form")[0]);
        const url = "http://192.168.230.1:8021/api/register";
        const data = {
            "ulogid": formdata.get("uid"),
            "uname": formdata.get("uname"),
            "uemail": formdata.get("uemail"),
            "upwd": formdata.get("upwd")
        };
        // 调用注册接口
        $.post(
            url,
            data,
            (res) => {
                if (res.status !== 0) {
                    return alert(res.msg);
                }
                alert(res.msg);
                $(".link-login").click();
            }
        );
    });
});