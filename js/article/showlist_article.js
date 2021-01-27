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

    // 获取用户文章列表
    showListArticle();

    $("#article_body").on("click", "button", function (e) {
        // 发布文章
        if ($(e.currentTarget).prop("id") == "btn-pub") {
            pubArticle($(e.currentTarget).attr("data-id"));
        }
        // 修改文章
        else if ($(e.currentTarget).prop("id") == "btn-edit") {
            sessionStorage.setItem("article_id", $(e.currentTarget).attr("data-id"));
            location.href = "./../../page/article/edit_article.html";
        }
        // 删除文章
        else if ($(e.currentTarget).prop("id") == "btn-delete") {
            delArticle($(e.currentTarget).attr("data-id"));
        }
    });
});

var data = {
    sortord: "DESC",
    start: 1,
    rows: 8
};

// 渲染分页
function renderPage(count) {
    var laypage = layui.laypage;
    laypage.render({
        elem: "page",
        count: count,
        limit: data.rows,
        limits: [4, 8, 12, 16, 20],
        curr: data.start,
        layout: ["limit", "prev", "page", "next", "skip", 'count'],
        jump: (obj, first) => {
            data.start = obj.curr;
            data.rows = obj.limit;
            // 不是首次
            if (!first) {
                showListArticle();
            }
        }
    });
}

// 获取用户文章列表
function showListArticle() {
    $.ajax({
        type: "GET",
        url: "/info/article//getarticle",
        data: data,
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
                var htmlStr = template("article_list", res);
                $("#article_body").empty().html(htmlStr);
            }
        }
    });
    // 获取用户文章数量
    $.ajax({
        type: "GET",
        url: "/info/article/getarticlenum",
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
                renderPage(res.data);
            }
        }
    });
}

// 发表文章
function pubArticle(id) {
    $.ajax({
        type: "POST",
        url: "/info/article/updartstatus",
        data: {
            id: id
        },
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
                // 渲染列表
                showListArticle();
                layer.open({
                    title: "提示",
                    icon: 1,
                    content: "发布文章成功！",
                    time: 1000
                });
            }
        }
    });
}

// 删除文章
function delArticle(id) {
    $.ajax({
        type: "POST",
        url: "/info/article/delarticle",
        data: {
            id: id
        },
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
                // 渲染列表
                showListArticle();
                layer.open({
                    title: "提示",
                    icon: 1,
                    content: "删除文章成功！",
                    time: 1000
                });
            }
        }
    });
}

template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
    var d = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    var h = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    var mm = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    var s = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
    return `${y}-${m}-${d} ${h}:${mm}:${s}`;
}