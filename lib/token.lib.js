const koajwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');

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
                try {
                    //jsonwebtoken.verify方法验证token是否有效
                    jsonwebtoken.verify(token, SECRET, {
                        complete: true
                    }, function (err, decoded) {
                        // console.log(err, decoded)
                        ctx.session = { ...decoded.payload, isLogin: true }
                    });
                } catch (error) {
                    // TODO: 这个功能暂不考虑
                    //token过期 生成新的token
                    // const newToken = getToken(user);
                    //将新token放入Authorization中返回给前端
                    // ctx.res.setHeader('Authorization', newToken);
                }
            }
        }
    }
    return next().catch(err => {
        if (err.status === 401) {
            console.log(err.status, '没有登录')
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
    // let token = ctx.header.authorization;
    // console.log(token)
    // let payload = jsonwebtoken.verify(token.split(' ')[1], SECRET, function (err, decoded) {
    //     console.log(err, decoded)
    // });
    // console.log(payload)
    // return next().catch((err) => {
    //     console.log(err.status)
    //     if (err.status === 401) {
    //         console.log('这里')
    //         ctx.status = 401;
    //         ctx.body = {
    //             code: 401,
    //             msg: err.message
    //         }
    //     } else {
    //         throw err;
    //     }
    // })
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