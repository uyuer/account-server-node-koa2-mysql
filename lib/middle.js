const {
    verifyParams, // 验证参数是否合法
} = require("../lib/verify");
const { isArray, isObject } = require("../lib/utils");

const userInfo = async (ctx, next) => {
    ctx.userInfo = function (name) {
        if (name) {
            return ctx.session[name]
        }
        return ctx.session;
    }
    await next();
}

// 获取参数
const arguments = async (ctx, next) => {
    ctx.arguments = function () {
        let params = {
            GET: ctx.request.query,
            POST: ctx.request.body,
        }[ctx.request.method];
        return params;
    }
    await next();
}
// 校验完成后的最后一步验证, 如果有错误将会抛出错误
const valid = async (ctx, next) => {
    ctx.valid = function (fields, body, accountsRules) {
        let { errors, validParams } = verifyParams(fields, body, accountsRules);
        if (errors.length > 0) {
            return ctx.throw(400, errors[0]);
        }
        // 替换下参数,或者其他
        let key = 'userId';
        let { userId } = ctx.userInfo();
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

// 校验完成后的最后一步验证, 如果有错误将会抛出错误
const transform = async (ctx, next) => {
    let userInfo = ctx.userInfo()
    let params = ctx.arguments();
    let { userId } = userInfo;

    ctx.transform = function (fields, body, accountsRules) {
        let { errors, validParams } = verifyParams(fields, body, accountsRules);
        if (errors.length > 0) {
            return ctx.throw(400, errors[0]);
        }
        return validParams;
    }
    await next();
}
module.exports = {
    userInfo,
    arguments,
    valid,
}