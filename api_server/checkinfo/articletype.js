const joi = require("@hapi/joi");
const addschema = joi.object({
    type: joi.string().min(2).max(10).required().error(new Error("文章类型格式错误！"))
});
const delschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("请选择要删除的文章类型编号！"))
});
const updschema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("请选择要修改的文章类型编号！")),
    type: joi.string().min(2).max(10).required().error(new Error("文章类型格式错误！"))
});
module.exports.schema = {
    addschema: addschema,
    delschema: delschema,
    updschema: updschema
};
module.exports.validate = (data, schema) => {
    const {
        error,
        value
    } = schema.validate(data);
    if (error) {
        return error
    }
    return null
}