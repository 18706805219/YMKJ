$(function () {
    // 验证表单数据
    var form = layui.form;
    form.verify({
        unick: [
            /^[\S]{0,16}$/,
            '昵称长度为0-16位,不能使用空格'
        ]
    });

    // 装获取到的数据
    var userInfo = null;

    // 渲染基础信息和修改信息
    getUserInfo();
    
    // 修改信息
    $("#form-editinfo").on("submit", function (e) {
        e.preventDefault();
        const url = "/info/editinfo";
        $.ajax({
            type: 'POST',
            url: url,
            data: $(this).serialize(),
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user")||""}`
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                // 重新渲染基础信息
                getUserInfo();
                // 重新渲染首页头像和昵称
                window.parent.getUserAvatarNick();
                layer.open({
                    title: '提示',
                    icon: 1,
                    content: res.msg,
                    time: 2000
                });
            }
        });
    });

    // 重置信息
    $(".reset_userinfo").on("click", (e) => {
        e.preventDefault();
        form.val("form_editinfo", userInfo);
    });

    // 调用获取用户信息接口
    function getUserInfo() {
        const url = "/info/getinfo";
        $.ajax({
            type: 'GET',
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user")||""}`
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: '用户登录信息无效，请重新登录！',
                        time: 2000,
                        end: function () {
                            location.href = "./../../login.html";
                        }
                    });
                }
                // 渲染基本信息
                renderUserInfo(res.data);
                // 渲染修改信息中的数据
                form.val("form_editinfo", res.data);
                userInfo = res.data;
            }
        });
    }

    // 渲染用户信息
    function renderUserInfo(user) {
        $("#myulogid").text(user.ulogid);
        $("#myuname").text(user.uname);
        $("#myuemail").text(user.uemail);
        $("#myunick").text(user.unick);
    }
});