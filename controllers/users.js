const query = require("./index");
const R = require("./../lib/responseBeautifier");
const { checkParams, filterParams, hasAttribute } = require("./../lib/utils");

// 用户表部分字段默认参数
let defaultValue = {
	male: "-1",
	avatar: "",
	status: "1",
};
// 用户表数据准入规则
let rules = {
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

exports.login=async(ctx)=>{

}

// 新增用户
// 插入用户只需要几个必选参数, 其他为可选
exports.insertUser = async (ctx) => {
	let body = ctx.request.body || {};
	// 检查必传参数是否存在
	let hasResult = hasAttribute(["username", "password", "email"], body);
	if (!hasResult) {
		return (ctx.response.body = R.set(hasResult, "200", "参数缺失"));
	}
	// 过滤指定参数
	let filter = filterParams(["username", "password", "male", "avatar", "email", "status"], body, 2);
	// let params = Object.assign(defaultValue, filter);
	// 合并请求和默认值
	let params = Object.keys(filter).reduce((total, currentValue) => {
		filter[currentValue] === "" ? (filter[currentValue] = defaultValue[currentValue]) : "";
		return total;
	}, filter);
	let { checkResult, errorMessage } = checkRules(rules, params);
	console.log(params, checkResult, errorMessage);
	if (!checkResult) {
		return (ctx.response.body = R.set(checkResult, "200", errorMessage));
	}
	// console.log("123123", checkResult);
	try {
		let _sql = "insert into users set ?;";
		let result = await query(_sql, params);
		if (result) {
			ctx.response.body = R.set(true, "200", "新增用户成功");
		} else {
			ctx.response.body = R.set(false, "200", "新增用户失败");
		}
	} catch (error) {
		ctx.response.body = R.set(
			{
				code: error.code,
				errno: error.errno,
				sqlMessage: error.sqlMessage,
				sql: error.sql,
			},
			error.statusCode || error.status,
			"未知异常"
		);
	}
};

// 更新一条用户信息
exports.updateOneUser = async (ctx) => {
	let body = ctx.request.body || {};
	let { id } = body;
	// 过滤出可用的值, 用户可以传单个或多个更新字段, 例:{username} | {username,male}
	// 对这个用户输入的对象, 必须要符合准入规则
	let params = filterParams(["username", "password", "male", "avatar", "email", "status"], body);
	if (!id) {
		return (ctx.response.body = R.set(false, "200", "用户id缺失"));
	}
	let rules = {
		username: [
			{ required: true, message: "用户名不可为空" },
			{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/, message: "用户名由2~20位中文、英文、数字和下划线字符组成" },
		],
		password: [
			{ required: true, message: "密码不可为空" },
			{ pattern: /^[\w\.\!]{6,18}$/, message: "密码由6~18位A~Za~z0~9_!.的字符组成" },
		],
		male: [
			{ required: true, message: "性别不可为空" },
			{ pattern: /[-101]/, message: "性别参数错误" },
		],
		avatar: [{ required: true, message: "头像不可为空" }],
		email: [
			{ required: true, message: "邮箱不可为空" },
			{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "邮箱格式错误" },
		],
		status: [
			{ required: true, message: "状态不可为空" },
			{ pattern: /[-101]/, message: "状态参数错误" },
		],
	};
	let errorMessage = "";
	let checkResult = Object.keys(params).every((key) => {
		let value = params[key];
		let rule = rules[key];
		let checkRule = rule.every((item) => {
			errorMessage = item.message;
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
		return checkRule;
	});
	if (!checkResult) {
		return (ctx.response.body = R.set(checkResult, "200", errorMessage));
	}
	try {
		let arr = Object.keys(params).map((key) => {
			return `${key} = '${params[key]}'`;
		});
		let str = arr.toString();
		let _sql = `UPDATE users set ${str} where id = ${id}`;
		console.log("更新用户信息", _sql);
		let result = await query(_sql, params);
		if (result) {
			ctx.response.body = R.set(result, "200");
		} else {
			ctx.response.body = R.set(null, "200");
		}
	} catch (error) {
		ctx.response.body = R.set(
			{
				code: error.code,
				errno: error.errno,
				sqlMessage: error.sqlMessage,
				sql: error.sql,
			},
			error.statusCode || error.status,
			"未知异常"
		);
	}
};

// 删除用户
exports.deleteOneUser = async (ctx) => {
	let params = ctx.request.body;
	let checkResult = await checkParams(["id"], params);
	if (!checkResult) {
		return (ctx.response.body = R.set(false, "200", "参数缺失"));
	}

	let _sql = `delete from users where id="${params.id}";`;
	try {
		let result = await query(_sql);
		if (result) {
			ctx.response.body = R.set(true, "200", "删除成功");
		} else {
			ctx.response.body = R.set(false, "200", "删除失败");
		}
	} catch (error) {
		ctx.response.body = R.set(
			{
				code: error.code,
				errno: error.errno,
				sqlMessage: error.sqlMessage,
				sql: error.sql,
			},
			error.statusCode || error.status,
			"未知异常"
		);
	}
};
// 查找-指定ID查找用户信息
exports.findOneUser = async (ctx) => {
	console.log('2')
	console.log("session:", ctx.session);
	// let params = ctx.request.query;
	// console.log(params);
	// let checkResult = await checkParams(["id"], params);
	// if (!checkResult) {
	// 	return (ctx.response.body = R.set(false, "200", "参数缺失"));
	// }

	// let _sql = `select * from users where id="${params.id}";`;
	// try {
	// 	let result = await query(_sql);
	// 	if (result) {
	// 		ctx.response.body = R.set(result[0], "200");
	// 	} else {
	// 		ctx.response.body = R.set(null, "200");
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

// 查找-多条件查找用户(暂时不多条件)
exports.findMultipleUser = async (ctx) => {
	let params = ctx.request.query;
	let { pageNum, pageSize } = params;
	let checkResult = await checkParams(["pageNum", "pageSize"], params);
	if (!checkResult) {
		return (ctx.response.body = R.set(null, "200", "参数缺失"));
	}
	// let queryStr = '';
	// Object.keys(params).forEach(key => {
	//     if (params[key]) {
	//         queryStr += `${key}=${params[key]} `
	//     }
	// })

	let _sql = `select * from users order by id limit ${(pageNum - 1) * pageSize}, ${pageSize};`;
	try {
		let result = await query(_sql);
		if (result) {
			ctx.response.body = R.set(result, "200");
		} else {
			ctx.response.body = R.set(null, "200");
		}
	} catch (error) {
		ctx.response.body = R.set(
			{
				code: error.code,
				errno: error.errno,
				sqlMessage: error.sqlMessage,
				sql: error.sql,
			},
			error.statusCode || error.status,
			"未知异常"
		);
	}
};
