const ApiErrorNames = require("./apiErrorNames");

/**
 * 自定义Api异常
 */
class ApiError extends Error {
	//构造方法
	// error_name: 错误名, 默认未知错误
	// extra_messge: 额外提示信息, 用于覆盖默认提示
	constructor(error_name, extra_messge = "") {
		super();

		var error_info = ApiErrorNames.getErrorInfo(error_name);

		this.name = error_name;
		this.code = error_info.code;
		this.message = extra_messge || error_info.message  // error_info.message + (extra_messge && " " + extra_messge);
	}
}

module.exports = ApiError;
