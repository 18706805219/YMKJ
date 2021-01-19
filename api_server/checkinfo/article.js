//导入@hapi/joi第三方中间件
const joi = require("@hapi/joi");
// 创建检验规则
const addartschema = joi.object({
    title: joi.string().min(2).max(30).required().error(new Error("文章标题格式有误！")),
    type_id: joi.number().integer().min(1).required().error(new Error("文章类型格式有误！")),
    content: joi.string().required().error(new Error("文章内容丢失！"))
});
const updartschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("文章编号格式有误！")),
    title: joi.string().min(2).max(30).required().error(new Error("文章标题格式有误！")),
    type_id: joi.number().integer().min(1).required().error(new Error("文章类型格式有误！")),
    content: joi.string().required().error(new Error("文章内容丢失！"))
});
const delartschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("文章编号格式有误！"))
});
const getartschema = joi.object({
    type_id: joi.number().integer().min(1).required().error(new Error("文章类型有误！")),
    sortord: joi.any().valid('DESC', 'ASC').required().error(new Error("排序方式错误！")),
    start: joi.number().integer().min(1).required().error(new Error("每页开始的索引格式有误！")),
    rows: joi.number().integer().min(1).required().error(new Error("一页显示的个数格式有误！"))
});
const getartauidschema = joi.object({
    author_id: joi.number().integer().min(1).required().error(new Error("作者id有错误！")),
    sortord: joi.any().valid('DESC', 'ASC').required().error(new Error("排序方式错误！")),
    start: joi.number().integer().min(1).required().error(new Error("每页开始的索引格式有误！")),
    rows: joi.number().integer().min(1).required().error(new Error("一页显示的个数格式有误！"))
});
const getartcontschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("文章id格式错误！"))
});
const sortordschema = joi.object({
    sortord: joi.any().valid('DESC', 'ASC').required().error(new Error("排序方式错误！")),
    start: joi.number().integer().min(1).required().error(new Error("每页开始的索引格式有误！")),
    rows: joi.number().integer().min(1).required().error(new Error("一页显示的个数格式有误！"))
});
module.exports.schema = {
    addartschema: addartschema,
    updartschema: updartschema,
    delartschema: delartschema,
    getartschema: getartschema,
    getartauidschema: getartauidschema,
    getartcontschema: getartcontschema,
    sortordschema: sortordschema
};
module.exports.validate = (data, schema) => {
    // 解构schema.validate对象
    const {error, value} = schema.validate(data);
    // 如果检验不匹配,那么返回检验提示信息,否则返回null
    if (error) {
        return error
    }
    return null
}