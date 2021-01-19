//导入@hapi/joi第三方中间件
const joi = require("@hapi/joi");
// 创建检验规则
const schema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error('用户信息暂时无法修改！')),
    uname: joi.string().required().error(new Error('输入用户名格式有误！')),
    uemail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error('输入邮箱格式有误！')),
    ulogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误')),
    unick:joi.string().max(16).error(new Error('用户昵称格式有误！'))
});
// 共享检验规则函数
module.exports = (data) => {
    // 解构schema.validate对象
    const {
        error,
        value
    } = schema.validate(data);
    // 如果检验不匹配,那么返回检验提示信息,否则返回null
    if (error) {
        return error
    }
    return null
}