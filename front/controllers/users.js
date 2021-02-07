const { session, schema } = require("../../lib/mysqlx");
const { usersRules, checkRules, checkField } = require("../../lib/usersRules");
const ApiError = require("../../lib/apiError");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { filterParams, filterRules } = require("../../lib/utils");

// 更新一条用户信息
exports.updateOneUser = async (ctx) => {
	console.log(`请求->用户->更新一条数据: updateOneUser.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = ['id', 'male', 'avatar'];
	// body(用户上传参数) fields(插入表中的字段,也叫合法字段)
	// 取出body和fields中共同的字段, 此处字段有可能有也有可能没有,只取出共同包含的
	let params = Object.keys(body).reduce((total, key) => {
		let res = fields.find(item => key === item);
		if (res) {
			total[key] = body[key];
		}
		return total;
	}, {});
	if (Object.keys(params).length <= 0) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, '参数缺失');
	}
	let { checkResult, errorMessage, errorType } = checkField(Object.keys(params), params); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	ctx.body = {
		name: 'updateOne'
	}
};

// 删除用户
// exports.deleteOneUser = async (ctx) => {

// };

// 查找-指定ID查找用户信息
// exports.findOneUser = async (ctx) => {

// };

// // 新增用户
// // 插入用户只需要几个必选参数, 其他为可选
// exports.insertUser = async (ctx) => {

// };

// // 查找-多条件查找用户(暂时不多条件)
// exports.findMultipleUser = async (ctx) => {

// };
