$(function () {
    // 渲染头像和用户名和昵称
    getUserAvatarNick();
    // 退出系统逻辑
    $(".link_exit").on("click", function () {
        layer.confirm(
            "是否需要退出系统?", {
                icon: 3,
                title: '提示'
            },
            (index) => {
                // 清除本地token
                if (localStorage.getItem("user")) {
                    localStorage.removeItem("user");
                }
                // 退出系统,跳转至登录界面
                location.href = "./login.html";
                // 清理弹出层
                layer.close(index);
            }
        );
    });

    // 当点击右上角基础信息时,让左侧栏中的首页选中状态取消
    $(".layui-layout-right .layui-nav-child a").on("click", function () {
        $(".sy_li").removeClass("layui-this");
    });
});

// 渲染头像和用户名和昵称
function getUserAvatarNick() {
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
                    content: '身份认证失败,请重新登录！',
                    time: 1500,
                    end: () => {
                        location.href = "./login.html";
                    }
                });
            } else {
                renderAvatar(res.data);
            }
        }
    });
}

// 渲染头像和用户名的方法
function renderAvatar(user) {
    // 获取用户昵称或者用户名
    const unick = user.unick || user.uname;
    // 渲染用户名或者昵称
    $(".welcome_text").html(`欢迎&nbsp;&nbsp;${unick}`);
    if (user.upicimage === null) {
        // 头像不存在
        $(".user_avatar").text(unick[0]).show().siblings(".avatar").hide();
    } else {
        // 头像存在
        $(".avatar").attr("src", user.upicimage).show().siblings(".user_avatar").hide();
    }
}