const {
    verifyParams, // 验证参数是否合法
} = require("../method/verify");
const { isArray, isObject } = require("../lib/utils");

// 给ctx添加方法
// 校验完成后的最后一步验证, 如果有错误将会抛出错误
const valid = async (ctx, next) => {
    ctx.valid = function (fields, body, accountsRules) {
        let { errors, validParams } = verifyParams(fields, body, accountsRules);
        if (errors.length > 0) {
            return ctx.throw(400, errors[0]);
        }
        // 替换下参数,或者其他
        let key = 'userId';
        let { userId } = ctx.userinfo();
        if (!userId) {
            ctx.throw(401, '未登录')
        }
        // 这种操作, 只适合简单的偏平对象和数组
        if (isObject(validParams)) {
            validParams[key] ? validParams[key] = userId : ''
        }
        if (isArray(validParams)) {
            validParams = validParams.map(item => {
                item[key] ? item[key] = userId : '';
                return item;
            })
        }
        return validParams;
    }
    await next();
}
module.exports = valid;