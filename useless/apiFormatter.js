const { getType } = require("../lib/utils");
// 指定要处理的接口, 格式化返回内容
/**
 * 在app.use(router)之前调用
 */
var apiFormatter = (ctx) => {
	//如果有返回数据，将返回数据添加到data中
	let result = ['undefined', 'null'].includes(getType(ctx.bodys)) ? null : ctx.bodys;
	ctx.body = {
		code: 200,
		message: "success",
		data: result
	};
};
module.exports = apiFormatter;
