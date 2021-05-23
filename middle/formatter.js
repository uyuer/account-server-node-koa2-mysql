const { apiFormatter } = require('../lib/method');

var formatter = (pattern) => {
    return async (ctx, next) => {
        try {
            await next();
            //先去执行路由
            var reg = new RegExp(pattern);
            //通过正则的url进行格式化处理
            if (reg.test(ctx.originalUrl)) {
                apiFormatter(ctx);
            }
        } catch (error) {
            //继续抛，让外层中间件处理日志
            ctx.app.emit('error', error, ctx)
        }

    };
};

module.exports = formatter;
