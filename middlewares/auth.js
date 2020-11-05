const ApiError = require("../lib/apiError");
const ApiErrorNames = require("../lib/apiErrorNames");

const auth = async (ctx, next) => {
	if (!ctx.session.logged) {
		console.log("已登录", ctx.session);
		await next();
	} else {
		console.log("未登录");
		throw new ApiError(ApiErrorNames.NOT_LOGIN);
	}
};

module.exports = { auth };
