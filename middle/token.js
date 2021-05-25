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

// 中间件对token进行验证
const authToken = async (ctx, next) => {
    if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
            //取出token
            const scheme = parts[0];
            const token = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                //jsonwebtoken.verify方法验证token是否有效
                jsonwebtoken.verify(token, SECRET, {
                    complete: true
                }, async (error, decoded) => {
                    if (!error) {
                        return ctx.session.user = decoded.payload;
                    }
                    return ctx.app.emit('error', error, ctx)
                });
            }
        }
    }
    return await next().catch(error => {
        return ctx.app.emit('error', error, ctx)
    });
}

// // 这种方式抛出错误状态为500
// // 中间件对token进行验证
// const authToken = async (ctx, next) => {
//     let { authorization = '' } = ctx.header;
//     if (!authorization) {
//         return ctx.app.emit('error', new Error('没有登录'), ctx);
//     }

//     let parts = authorization.split(' ');
//     if (parts.length != 2) {
//         return ctx.app.emit('error', new Error('authorization format error'), ctx);
//     }

//     const scheme = parts[0];
//     const token = parts[1];
//     if (/^Bearer$/i.test(scheme)) {
//         //jsonwebtoken.verify方法验证token是否有效
//         jsonwebtoken.verify(token, SECRET, {
//             complete: true
//         }, function (error, decoded) {
//             if (!error) {
//                 return ctx.session = { ...decoded.payload, isLogin: true }
//             }
//             return ctx.app.emit('error', error, ctx)
//         });
//     } else {
//         return ctx.app.emit('error', new Error('authorization type error'), ctx);
//     }
//     return await next();
// }

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