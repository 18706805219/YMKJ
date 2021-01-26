$(function () {
    // 点击注册账号跳转到注册账号界面
    $(".link-reg").on("click", function () {
        $(".reg-box").stop().show().siblings("div").stop().hide();
        $("#form-login")[0].reset();
    });
    // 点击登录跳转到登录界面
    $(".link-login").on("click", function () {
        $(".login-box").stop().show().siblings("div").stop().hide();
        $("#form-reg")[0].reset();
    });
    // 点击找回密码跳转到找回密码界面
    $(".link-find").on("click", function () {
        $(".findpwd-box").stop().show().siblings("div").stop().hide();
        // 展示验证码
        code_draw();
    });
    // 从找回密码界面到返回登录界面
    $(".btn-backLog").on("click", function () {
        $(".link-login").click();
        $("#form-login")[0].reset();
        // 清空找回密码中的表单
        $.each($(".fpwd-content .layui-form"), (i, item) => {
            item.reset();
        });
        
        // 找回密码模块样式初始化
        cutStyle(0);
        user = null;
        if (sessionStorage.getItem("ecode")) {
            sessionStorage.removeItem("ecode");
        }
        if (sessionStorage.getItem("idtoken")) {
            sessionStorage.removeItem("idtoken");
        }
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

    // 点击后刷新验证码
    $("#canvas").on('click', function () {
        code_draw();
    });

    function cutStyle(index) {
        // 切换找回密码内容
        $(".fpwd-content>div").addClass("fpwd").eq(index).removeClass("fpwd");
        // 切换找回密码导航部分
        // 获取strong元素列表
        var strongList = $(".layui-breadcrumb>strong");
        $.each(strongList, (i, item) => {
            $(item).text($(item).text());
        });
        $(strongList[index]).html(`<cite>${$(strongList[index]).text()}</cite>`);
    }

    // 登录功能实现
    $("#form-login").on("submit", function (e) {
        // 去除form表单默认事件
        e.preventDefault();
        // 登录功能的接口地址
        const url = "/api/login";
        // 调用登陆接口
        $.post(
            url,
            $(this).serialize(),
            (res) => {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                // 创建一个会话存储,用于判断用户是否退出过浏览器
                // true:没退出过
                sessionStorage.setItem("isexit", true);
                // 本地存储对象
                const storage = window.localStorage;
                // 将token字符串添加到本地存储
                storage.setItem("user", res.token);
                $("#form-login")[0].reset();
                layer.open({
                    title: '提示',
                    icon: 1,
                    content: res.msg,
                    time: 1000,
                    end: () => {
                        location.href = "./index.html";
                    }
                });
            }
        );
    });

    // 注册功能实现
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        const url = "/api/register";
        // 调用注册接口
        $.post(
            url,
            $(this).serialize(),
            (res) => {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                layer.open({
                    title: '提示',
                    icon: 1,
                    content: res.msg + ",是否跳转至登录页面",
                    btn: ["确定", "取消"],
                    btn1: (index) => {
                        layer.close(index);
                        $(".link-login").click();
                        $("#form-reg")[0].reset();
                    },
                    btn2: () => {
                        $("#form-reg")[0].reset();
                    }
                });
            }
        );
    });

    // 找回密码功能实现
    // 填写账号
    // 创建一个对象用来装查询到的信息
    var user = null;
    $("#form-fpwdid").on("submit", function (e) {
        e.preventDefault();
        const url = "/api/getuser";
        $.get(
            url,
            $(this).serialize(),
            (res) => {
                if (res.status != 0) {
                    $(".input-val").val('');
                    code_draw();
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                }
                // 将输入的内容转为大写，可通过这步进行大小写验证
                var val = $(".input-val").val().toLowerCase();
                // 获取生成验证码值
                var num = $('#canvas').attr('data-code');
                if (val == '') {
                    code_draw();
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: '请输入验证码！'
                    });
                } else if (val != num) {
                    $(".input-val").val('');
                    code_draw();
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: '验证码错误！请重新输入！'
                    });
                } else {
                    $(".input-val").val('');
                    user = res.data[0];
                    // 切换样式
                    cutStyle(1);
                }
            }
        );
    });
    // 邮箱认证
    // 获取邮箱验证码
    $(".btn-getemailcode").on("click", function () {
        // 判断user是否存在
        if (!user) {
            layer.open({
                title: '提示',
                icon: 2,
                content: "请先输入您要找回的账号！"
            });
            // 清空找回密码中的表单
            $.each($(".fpwd-content .layui-form"), (i, item) => {
                item.reset();
            });
            return cutStyle(0);
        } else if (user.uemail !== $("#uemail-input").val()) {
            return layer.open({
                title: '提示',
                icon: 2,
                content: "你输入的账号和邮箱不对应,请重新输入！"
            });
        }
        const url = "/api/getecode";
        const data = {
            id: user.id,
            uemail: $("#uemail-input").val()
        };
        $.post(
            url,
            data,
            (res) => {
                if (res.status != 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                }
                layer.open({
                    title: "提示",
                    icon: 1,
                    content: res.msg,
                    time: 1000
                });
                // 将token字符串装进本地存储
                window.sessionStorage.setItem("ecode", res.token);
                var i = 60;
                $('.btn-getemailcode').addClass("layui-disabled").attr("disabled", "disabled");
                // 创建计时器
                var interval = setInterval(() => {
                    i--;
                    $('.btn-getemailcode').text(`${i}S`);
                    if (i == 0) {
                        $('.btn-getemailcode').removeClass("layui-disabled").removeAttr("disabled");
                        $('.btn-getemailcode').text("获取邮箱验证码");
                        // 移除本地token字符串
                        if (sessionStorage.getItem("ecode")) {
                            sessionStorage.removeItem("ecode");
                        }
                        clearInterval(interval);
                    }
                }, 1000);
            }
        );
    });
    // 验证邮箱验证码
    $("#form-fpwdemail").on("submit", function (e) {
        e.preventDefault();
        if (!sessionStorage.getItem("ecode")) {
            return layer.open({
                title: "提示",
                icon: 2,
                content: "邮箱动态码已失效,请重新获取邮箱动态码!"
            });
        }
        const url = '/info/yzecode';
        $.ajax({
            type: 'POST',
            url: url,
            data: $("#form-fpwdemail").serialize(),
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("ecode")||""}`
            },
            success: (res) => {
                if (res.status != 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                } else {
                    // 邮箱动态码验证成功,在本地存储idtoken字符串
                    sessionStorage.setItem("idtoken", res.token);
                    // 将ecodetoken字符串销毁
                    if (sessionStorage.getItem("ecode")) {
                        sessionStorage.removeItem("ecode");
                    }
                    // 提示用户在10分钟之内完成修改密码操作
                    layer.open({
                        title: "提示",
                        icon: 3,
                        content: "请在10分钟之内完成重置密码!",
                        time: 2000,
                        end: () => {
                            // 切换找回密码样式
                            cutStyle(2);
                            var i = 10 * 60;
                            // 创建计时器
                            var interval = setInterval(() => {
                                i--;
                                if (i == 0) {
                                    // 移除本地token字符串
                                    if (sessionStorage.getItem("idtoken")) {
                                        sessionStorage.removeItem("idtoken");
                                    }
                                    layer.open({
                                        title: "提示",
                                        icon: 2,
                                        content: "重置密码超时,请重新找回密码",
                                        time: 2000,
                                        end: () => {
                                            // 清空找回密码中的表单
                                            $.each($(".fpwd-content .layui-form"), (i, item) => {
                                                item.reset();
                                            });
                                            // 找回密码模块样式初始化
                                            cutStyle(0);
                                            user = null;
                                        }
                                    });
                                    clearInterval(interval);
                                }
                            }, 1000);
                        }
                    });
                }
            }
        });
    });
    // 重置密码
    $("#form-fpwdpwd").on("submit", function (e) {
        e.preventDefault();
        if (!sessionStorage.getItem("idtoken")) {
            return layer.open({
                title: "提示",
                icon: 2,
                content: "身份认证失败,请重新找回密码!",
                time: 2000,
                end: () => {
                    // 清空找回密码中的表单
                    $.each($(".fpwd-content .layui-form"), (i, item) => {
                        item.reset();
                    });
                    // 找回密码模块样式初始化
                    cutStyle(0);
                    user = null;
                }
            });
        }
        const url = "/info/resetpwd";
        $.ajax({
            type: 'POST',
            url: url,
            data: $("#form-fpwdpwd").serialize(),
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("idtoken")||""}`
            },
            success: (res) => {
                if (res.status != 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                }
                // 销毁token字符串
                if (sessionStorage.getItem("idtoken")) {
                    sessionStorage.removeItem("idtoken");
                }
                cutStyle(3);
                layer.open({
                    title: "提示",
                    icon: 1,
                    content: res.msg,
                    time: 1000
                });
                $(".finalydiv span").text(res.msg);
            }
        });
    });
});