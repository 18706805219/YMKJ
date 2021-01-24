$(function () {
    // 先进行身份认证
    if (!localStorage.getItem("user")) {
        return layer.open({
            title: '提示',
            icon: 2,
            content: '用户登录信息无效，请重新登录！',
            time: 1500,
            end: function () {
                location.href = "./../../login.html";
            }
        });
    }
    // 验证表单数据
    var form = layui.form;
    form.verify({
        upwd: [
            /^[\S]{6,18}$/,
            '密码长度为6-18位,不能使用空格！'
        ],
        newupwd: value => {
            if (value === $("[name=oldupwd]").val()) {
                return "新密码和旧密码不能相同！";
            }
        },
        aginupwd: value => {
            if (value !== $("[name=newupwd]").val()) {
                return "两次密码不一致！";
            }
        }
    });

    // 修改密码功能实现
    $("#form-editpwd").on("submit", function (e) {
        e.preventDefault();
        // 调用修改密码接口
        const url = "/info/editpwd";
        $.ajax({
            type: "POST",
            url: url,
            data: $("#form-editpwd").serialize(),
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user")||""}`
            },
            success: res => {
                if (res.status !== 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg,
                        time: 1000
                    });
                } else {
                    $("#form-editpwd")[0].reset();
                    layer.open({
                        title: "提示",
                        icon: 1,
                        content: "修改密码成功！",
                        time: 1000
                    });
                }
            }
        });
    });
});