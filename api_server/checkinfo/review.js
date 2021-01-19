const joi = require("@hapi/joi");
const getreviewschema = joi.object({
    article_id: joi.number().integer().min(1).required().error(new Error("文章编号格式有误！")),
    sortord: joi.any().valid('DESC', 'ASC').required().error(new Error("排序方式有误！")),
    start: joi.number().integer().min(1).required().error(new Error("每页开始的索引格式有误！")),
    rows: joi.number().integer().min(1).required().error(new Error("一页显示的个数格式有误！"))
});
const addreviewschema = joi.object({
    article_id: joi.number().integer().min(1).required().error(new Error("文章编号格式有误！")),
    content: joi.string().max(100).required().error(new Error("评论内容格式错误！"))
});
const delreviewschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("评论编号格式有误！"))
});
const delmyreviewschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("评论编号格式有误！"))
});
module.exports.schema = {
    getreviewschema: getreviewschema,
    addreviewschema: addreviewschema,
    delreviewschema: delreviewschema,
    delmyreviewschema: delmyreviewschema
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