const { apiFormatter } = require('../method');

var formatter = (pattern) => {
    return async (ctx, next) => {
        // let { id: userId } = ctx.session;
        // ctx.request.query = { ...ctx.request.query, userId }
        // ctx.request.body = { ...ctx.request.body, userId }
        try {
            await next();
            //先去执行路由
            var reg = new RegExp(pattern);
            //通过正则的url进行格式化处理
            if (reg.test(ctx.originalUrl)) {
                apiFormatter(ctx);
            }
        } catch (error) {
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            // if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
            // 	ctx.status = 200;
            // 	ctx.body = {
            // 		code: error.code,
            // 		message: error.message,
            // 		data: false,
            // 	};
            // }

            //继续抛，让外层中间件处理日志
            ctx.app.emit('error', error, ctx)
            // throw error;
        }

    };
};

module.exports = formatter;
