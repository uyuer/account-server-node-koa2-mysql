const ApiError = require("../lib/apiError");
const ApiErrorNames = require("../lib/apiErrorNames");

const auth = async (ctx, next) => {
	// console.log(ctx.session)
	if (!ctx.session.isLogin) {
		console.log("已登录");
		await next();
	} else {
		console.log("未登录");
		throw new ApiError(ApiErrorNames.NOT_LOGIN);
	}
};

module.exports = { auth };
