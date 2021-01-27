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
    var form = layui.form;
    form.render();

    // 渲染下拉列表
    renderArticleType();

    //图像上传
    $("#chooseImg").on("change", function (e) {
        var file = $(this)[0];
        if (!file.files || !file.files[0]) {
            return;
        }
        $("#filename").text(file.files[0].name);
        var reader = new FileReader();
        reader.onload = function (evt) {
            var replaceSrc = evt.target.result;
            //更换cropper的图片
            $('#image').cropper('replace', replaceSrc, false); //默认false，适应高度，不失真
        }
        reader.readAsDataURL(file.files[0]);
    });

    //cropper图片裁剪
    $('#image').cropper({
        aspectRatio: 200 / 240, //默认比例
        preview: '.previewImg', //预览视图
        guides: true, //裁剪框的虚线(九宫格)
        autoCropArea: 0.5, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        movable: false, //是否允许移动图片
        dragCrop: true, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true, //是否允许移动剪裁框
        resizable: true, //是否允许改变裁剪框的大小
        zoomable: false, //是否允许缩放图片大小
        mouseWheelZoom: false, //是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true, //是否允许通过触摸移动来缩放图片
        rotatable: true, //是否允许旋转图片
        crop: function (e) {
            // 输出结果数据裁剪图像。
        }
    });

    //旋转
    $(".cropper-rotate-btn").on("click", function (e) {
        e.preventDefault();
        $('#image').cropper("rotate", 45);
    });

    //复位
    $(".cropper-reset-btn").on("click", function (e) {
        e.preventDefault();
        $('#image').cropper("reset");
    });

    //换向
    var flagX = true;
    $(".cropper-scaleX-btn").on("click", function (e) {
        e.preventDefault();
        if (flagX) {
            $('#image').cropper("scaleX", -1);
            flagX = false;
        } else {
            $('#image').cropper("scaleX", 1);
            flagX = true;
        }
        flagX != flagX;
    });

    // 裁剪后的处理
    $("#edit_article").on("submit", function (e) {
        e.preventDefault();
        var data = new FormData($(this)[0]);
        if (data.get("status") === "publish") {
            data.set("status", "发布");
        } else if (data.get("status") === "save") {
            data.set("status", "草稿");
        }
        // 获取被裁剪后的canvas
        var cas = $('#image').cropper('getCroppedCanvas', {
            width: 200,
            height: 240
        });
        // 将画布中的内容转换为文件对象
        cas.toBlob(Blob => {
            // 将文件对象保存到data中
            data.append("conpicimage", Blob);
            data.append("id", sessionStorage.getItem("article_id"));
            // 调用发布文章接口
            pubArticle(data);
        });
    });

    // 点击立即发布将隐藏域中的value改为publish
    $("#btn-pubilish").on("click", function () {
        $("[name='status']").val("publish");
    });

    // 点击保存草稿将隐藏域中的value改为save
    $("#btn-save").on("click", function () {
        $("[name='status']").val("save");
    });

    // 渲染文章信息
    function renderArticle(id) {
        $.ajax({
            type: "GET",
            url: "/articlenoid/getarticlecontent",
            data: {
                id: id
            },
            success: res => {
                if (res.status !== 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                }
                // 将数据存储起来
                const article_info = res.data[0];
                // 文章标题
                $("[name='title']").val(article_info.title);
                // 下拉列表
                $("#article_tp").text(article_info.type).val(article_info.type_id);
                // 内容
                $("[name='content']").val(article_info.content);
                // 封面
                $("#image").attr("src", `http://192.168.230.1:8021${article_info.conpicimage}`);
                $('#image').cropper('replace', `http://192.168.230.1:8021${article_info.conpicimage}`, false);
                $("#filename").text("未选择图片");
                // 重新渲染
                form.render();
            }
        });
    }

    // 重置发布文章界面
    $("#btn-reset").on("click", function (e) {
        e.preventDefault();
        renderArticleType();
    });

    // 渲染文章类型下拉列表和文章信息
    function renderArticleType() {
        $.ajax({
            type: "GET",
            url: "/info/article/arttype",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user")||""}`
            },
            success: res => {
                if (res.status !== 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                } else {
                    const htmlStr = template("article_type", res);
                    $("[name=type_id]").html(htmlStr);
                    // 渲染文章信息
                    renderArticle(sessionStorage.getItem("article_id"));
                }
            }
        });
    }

    // 调用发布文章接口
    function pubArticle(data) {
        $.ajax({
            type: "POST",
            url: "/info/article/updarticle",
            data: data,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user")||""}`
            },
            // 因为传的是form-data数据,所以对数据不用处理
            cache: false,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                if (sessionStorage.getItem("article_id")) {
                    sessionStorage.removeItem("article_id");
                }
                layer.open({
                    title: '提示',
                    icon: 1,
                    content: "文章修改/保存成功!",
                    time: 500,
                    end: () => {
                        // 跳转至文章列表
                        location.href = "./../../page/article/showlist_article.html";
                    }
                });
            }
        });
    }
});