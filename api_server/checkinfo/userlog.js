//导入@hapi/joi第三方中间件
const joi = require("@hapi/joi");
// 创建检验规则
const schema = joi.object({
    ulogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误')),
    upwd: joi.string().min(6).max(18).required().error(new Error('用户密码为6-18位任意字符'))
});
// 共享检验规则函数
module.exports = (data) => {
    // 解构schema.validate对象
    const {error, value} = schema.validate(data);
    // 如果检验不匹配,那么返回检验提示信息,否则返回null
    if (error) {
        return error
    }
    return null
}