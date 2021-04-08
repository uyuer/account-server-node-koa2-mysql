const koajwt = require('koa-jwt');
const { SECRET } = require('../config');

// 收集token
const gatherToken = async (ctx, next) => {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    ctx.header = { 'authorization': "Bearer " + (params.token || '') }
    await next();
}

// 中间件对token进行验证
const authToken = async (ctx, next) => {
    // let token = ctx.header.authorization;
    // let payload = await util.promisify(jsonwebtoken.verify)(token.split(' ')[1], SECRET);
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: err.message
            }
        } else {
            throw err;
        }
    })
}

// 排除不需要验证的接口
const unless = koajwt({ SECRET }).unless({
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