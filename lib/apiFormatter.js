const ApiError = require("./apiError.lib");

// 指定要处理的接口, 格式化返回内容
/**
 * 在app.use(router)之前调用
 */
var apiFormatter = (ctx) => {
	//如果有返回数据，将返回数据添加到data中
	if (ctx.body !== undefined || ctx.body !== null) {
		ctx.body = {
			code: 200,
			message: "success",
			data: ctx.body,
		};
	} else {
		ctx.body = {
			code: 200,
			message: "success",
			data: '无返回值'
		};
	}
};

var urlFilter = (pattern) => {
	return async (ctx, next) => {
		var reg = new RegExp(pattern);

		try {
			//先去执行路由
			await next();
		} catch (error) {
			//如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
			if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
				ctx.status = 200;
				ctx.body = {
					code: error.code,
					message: error.message,
					data: false,
				};
			}
			//继续抛，让外层中间件处理日志
			throw error;
		}

		//通过正则的url进行格式化处理
		if (reg.test(ctx.originalUrl)) {
			apiFormatter(ctx);
		}
	};
};

// module.exports = apiFormatter;
module.exports = urlFilter;
