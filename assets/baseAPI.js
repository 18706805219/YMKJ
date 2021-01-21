// 每次执行jq中的ajax请求前(不限制请求方式,只要是ajax请求),都会先执行这个函数,目的是为了不重复写接口地址的前缀
$.ajaxPrefilter((options) => {
    options.url = "http://192.168.230.1:8021" + options.url;
});