const koajwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');
const { instanceTable } = require('../lib/method');

// 收集token
const gatherToken = async (ctx, next) => {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    ctx.header.authorization = ctx.header.authorization || params.token || ''
    await next();
}

// 验证失败将会抛出错误
const authToken = async (ctx, next) => {
    return await next().catch(error => {
        return ctx.app.emit('error', error, ctx)
    });
}

// 排除不需要验证的接口
const unless = koajwt({ secret: SECRET }).unless({
    // 登录接口不需要验证
    path: [
        /^\/api\/users\/register/,
        /^\/api\/users\/sendcode/,
        /^\/api\/users\/login/,
        /^\/api\/users\/logout/,
    ]
})

module.exports = {
    gatherToken,
    authToken,
    unless,
}