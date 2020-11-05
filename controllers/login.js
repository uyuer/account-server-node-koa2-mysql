const query = require("./index");
const ApiError = require("../lib/apiError");
const ApiErrorNames = require("../lib/apiErrorNames");

const { checkParams, filterParams, hasAttribute, getParams } = require("./../lib/utils");

// 用户表部分字段默认参数
let defaultValue = {
	male: "-1",
	avatar: "",
	status: "1",
};
// 用户表数据准入规则
let paramsRules = {
	username: [
		{ required: true, message: "用户名不可为空" },
		{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/, message: "用户名由2~20位中文、英文、数字和下划线字符组成" },
	],
	password: [
		{ required: true, message: "密码不可为空" },
		{ pattern: /^[\w\.\!]{6,18}$/, message: "密码由6~18位A~Za~z0~9_!.的字符组成" },
	],
	male: [
		{ required: false, message: "" },
		{ pattern: /[-101]/, message: "性别参数错误" },
	],
	avatar: [{ required: false, message: "头像不可为空" }],
	email: [
		{ required: true, message: "邮箱不可为空" },
		{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "邮箱格式错误" },
	],
	status: [
		{ required: true, message: "状态不可为空" },
		{ pattern: /[-101]/, message: "状态参数错误" },
	],
};

function checkRules(rules, params) {
	let errorMessage = "";
	let checkResult = Object.keys(params).every((key) => {
		let value = params[key];
		console.log(key, value);
		let rule = rules[key];
		if (!rule) {
			return true;
		}
		return rule.every((item) => {
			errorMessage = item.message;
			// if (item.hasOwnProperty("defaultValue")) {
			// 	if (!value) {
			// 		value = item.defaultValue;
			// 	}
			// }
			if (item.hasOwnProperty("required")) {
				if (item.required && !value) {
					return false;
				}
			}
			if (item.hasOwnProperty("pattern")) {
				var patt = new RegExp(item.pattern);
				if (!patt.test(value)) {
					return false;
				}
			}
			errorMessage = "";
			return true;
		});
	});
	return { checkResult, errorMessage };
}

exports.login = async (ctx) => {
	let content = ["username", "password"];
	let body = ctx.request.body || {};
	let params = getParams(content, body);

	// 判断参数是否缺失
	let lackKey = "";
	let isLack = content.every((key) => {
		if (body.hasOwnProperty(key)) {
			return true;
		}
		lackKey = key;
		return false;
	});
	if(!isLack){
		throw new ApiError(ApiErrorNames.LACK_PARAMS);
	}

	// let error = { errors: {}, values: {} };
	// error = content.map((item) => {
	// 	error.errors[item] = [];
	// 	error.values[item] = [];
	// });

	// let checkList = content.map((item) => {
	// 	let param = paramsRules[item];
	// 	return { [item]: param };
	// });
	// let rules = getRules(content, paramsRules);
	// let checkList = [];
	// // content.map((item) => {
	// // 	let param = paramsRules[item];
	// // 	checkList.push({ [item]: param });
	// // });

	// ctx.session.logged = true;
	// ctx.session.username = "zhangsan";

	ctx.body = {
		params: params,
		// checkList,
		name: "login",
	};
	// let hasResult = hasAttribute(["username", "password"], body);
	// if (!hasResult) {
	// return (ctx.response.body = R.set(hasResult, "200", "参数缺失"));
	// }
	// try {
	// 	let _sql = "insert into users set ?;";
	// 	let result = await query(_sql, params);
	// 	if (result) {
	// 		ctx.response.body = R.set(true, "200", "新增用户成功");
	// 	} else {
	// 		ctx.response.body = R.set(false, "200", "新增用户失败");
	// 	}
	// } catch (error) {
	// 	ctx.response.body = R.set(
	// 		{
	// 			code: error.code,
	// 			errno: error.errno,
	// 			sqlMessage: error.sqlMessage,
	// 			sql: error.sql,
	// 		},
	// 		error.statusCode || error.status,
	// 		"未知异常"
	// 	);
	// }
};
