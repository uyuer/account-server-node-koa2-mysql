const { session, schema } = require("../../lib/mysqlx");
const { usersRules, checkRules, checkField } = require("../../lib/usersRules");
const ApiError = require("../../lib/apiError");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { filterParams, filterRules, formatFetch } = require("../../lib/utils");
// var AES = require("crypto-js/aes");

exports.register = async (ctx) => {
	console.log(`请求->用户->注册: register.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = ['username', 'password', 'repassword', 'email'];
	let { checkResult, errorMessage, errorType } = checkField(fields, body); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	try {
		let { username, password, repassword, email } = params;
		let keys = ['username', 'password', 'email'];
		let values = [username, password, email]

		let ins = await schema;
		let table = ins.getTable('users');
		// 用户名,密码,邮箱(用于找回密码,首先需要激活邮箱,激活邮箱则可以使用邮箱登录)不可为空
		// 检查用户名是否被使用
		let usernameBeUsed = await table.select('id').where(`username=:u`).bind('u', username).execute().then(s => formatFetch(s));
		if (usernameBeUsed) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '此用户名已被使用');
		}
		// 检查邮箱是否被使用
		let emailBeUsed = await table.select('id').where(`email=:u`).bind('u', email).execute().then(s => formatFetch(s));
		if (emailBeUsed) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '此邮箱已被使用'); // 邮箱已被使用
		}
		// 校验用户两次输入密码是否一致
		if (password !== repassword) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '两次输入密码不一致');
		}
		let res = await table.insert(keys).values(values).execute();
		ctx.body = true;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

exports.login = async (ctx) => {
	// var ciphertext = AES.encrypt('adgjmptw123', 'adgjmptw123').toString();
	console.log(`请求->用户->登录: login.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = ['username', 'password'];
	let params = filterParams(fields, body); // 获取指定参数
	let { username, password } = params;
	let patt = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
	let isEmail = patt.test(username); // 判断是否是邮箱
	// console.log(isEmail, isEmail ? ['email', 'password'] : fields)
	let rules = filterRules(isEmail ? ['email', 'password'] : fields, usersRules); // 获取参数对应规则; 如果是邮箱则获取邮箱对应规则
	let { checkResult, errorMessage, errorType } = checkRules(params, rules); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	// 校验用户两次输入密码是否一致
	try {
		let ins = await schema;
		let table = ins.getTable('users');
		let info = await table.select('id', 'status').where(`${isEmail ? 'email' : 'username'}=:u`).bind('u', username).execute().then(s => formatFetch(s))
		if (!info) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户不存在');
		} else {
			let { status } = info;
			if (status === '0') {
				throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户被冻结');
			}
		}
		let userinfo = await table
			.select('id', 'username', 'male', 'avatar', 'email', 'status', 'createTime', 'updateTime')
			.where(`${isEmail ? 'email' : 'username'}=:u and password=:p`)
			.bind('u', username)
			.bind('p', password)
			.execute()
			.then(s => {
				let values = s.fetchOne();
				if (!values) {
					throw new ApiError(ApiErrorNames.ERROR_PARAMS, '密码错误');
				}
				let columns = s.getColumns();
				let data = columns.reduce((total, currentValue, index, arr) => {
					let key = currentValue.getColumnName();
					total[key] = values[index];
					return total;
				}, {})
				return data;
			})
		if (userinfo) {
			ctx.session = {
				username: userinfo.username,
				id: userinfo.id,
				email: userinfo.email,
				isLogin: true
			}
		}
		ctx.body = userinfo;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

exports.loginOut = async (ctx) => {
	ctx.session = null
	ctx.body = true
}

// exports.login = async (ctx) => {
// 	console.log(`请求->用户->登录: login.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
// 	let body = ctx.request.body || {};
// 	let fields = ['username', 'password'];
// 	let params = filterParams(fields, body); // 获取指定参数
// 	let rules = filterRules(fields, usersRules); // 获取参数对应规则
// 	// let { checkResult, errorMessage, errorType } = checkRules(params, rules); // 校验参数是否合法
// 	// if (!checkResult) {
// 	// 	throw new ApiError(errorType, errorMessage);
// 	// }
// 	// 校验用户两次输入密码是否一致
// 	let { username, password } = params;
// 	let ins = await schema;
// 	let table = ins.getTable('users');
// 	try {
// 		let res = await table
// 			.select('id', 'username', 'male', 'avatar', 'email', 'status', 'createTime', 'updateTime')
// 		let res1 = await res.where('username=:u and password=:p')
// 			.bind('u', username)
// 			.bind('p', password)
// 			.execute()
// 		let res2 = await res.where('email=:u and password=:p')
// 			.bind('u', username)
// 			.bind('p', password)
// 			.execute()
// 		let values = res1.fetchOne() || res2.fetchOne()
// 		if (!values) {
// 			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '');
// 		}
// 		let columns = res1.getColumns();
// 		let data = columns.reduce((total, currentValue, index, arr) => {
// 			let key = currentValue.getColumnName();
// 			total[key] = values[index];
// 			return total;
// 		}, {})
// 		ctx.body = data;
// 	} catch (error) {
// 		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
// 	}
// };
