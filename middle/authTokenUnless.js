const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');

// 解析token的值, 并将用户信息保存在session中
const userVerifyUnless = (params) => {
    let { path } = params || {};
    return async (ctx, next) => {
        // 是否是 无需用户状态验证的路径[不是:true 是:false]
        let result = path.every((p => {
            if (!p.test(ctx.request.path)) {
                return true;
            } else {
                return false;
            }
        }))
        // 如果不是被排除路径, 则解析token的值, 并将用户信息保存在session中
        if (result) {
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
        }
        return await next();
    }
}
module.exports = userVerifyUnless({
    path: [
        /^\/api\/users\/register/,
        /^\/api\/users\/sendcode/,
        /^\/api\/users\/login/,
        /^\/api\/users\/logout/,
    ]
});

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
