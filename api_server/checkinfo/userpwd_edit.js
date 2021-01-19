//导入@hapi/joi第三方中间件
const joi = require("@hapi/joi");
// 判断旧密码、新密码、重复密码格式是否正确
const schema = joi.object({
    oldupwd: joi.string().min(6).max(18).required().error(new Error('旧密码为6-18位任意字符！')),
    // 新密码和旧密码检验规则一样
    newupwd: joi.string().min(6).max(18).required().error(new Error('新密码为6-18位任意字符！')),
    // 重复密码和新密码的值保持一致,joi.ref()方法可以判断两个值是相等的
    aginupwd: joi.any().valid(joi.ref('newupwd')).error(new Error("重复密码和新密码不一致"))
});
// 新密码和旧密码一致抛出的异常
const schemapwd = joi.object({
    oldupwd: joi.string().min(6).max(18).required().error(new Error('旧密码为6-18位任意字符')),
    // 新密码和旧密码的值要不一致,如果一致抛出异常
    newupwd: joi.not(joi.ref('oldupwd')).error(new Error("旧密码和新密码一致")),
    aginupwd: joi.any().valid(joi.ref('newupwd')).required().error(new Error("重复密码和新密码不一致"))
});
// 共享检验规则函数
module.exports = (data) => {
    // 解构schema.validate对象
    var {
        error,
        value
    } = schema.validate(data);
    // 如果检验不匹配,那么返回检验提示信息,否则返回null
    if (error) {
        return error;
    }
    var {
        error,
        value
    } = schemapwd.validate(data);
    if (error) {
        return error;
    }
    return null;
}