const { session, schema } = require('../../lib/mysqlx');
const {
	rules, // 参数规则
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require('../../lib/usersRules');
const ApiError = require('../../lib/apiError');
const ApiErrorNames = require('../../lib/apiErrorNames');
const { sendEmailCode } = require('../../lib/email')
const { filterParams, filterRules, formatFetch, formatFetchAll } = require('../../lib/utils');
// var AES = require("crypto-js/aes");

// // AES加密 加密用户网站密码
// let ciphertext = CryptoJS.AES.encrypt('123456', '123456').toString();
// let plaintext = CryptoJS.AES.decrypt(ciphertext, '123456').toString(CryptoJS.enc.Utf8);
// console.log(ciphertext, plaintext)

// // sha256加密 加密用户登录密码, 用户密码为密钥key
// CryptoJS.SHA256('123456', '123456').toString()

// 用户注册
exports.register = async (ctx) => {
	console.log(`请求->用户->注册: public.register; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	try {
		let body = ctx.request.body || {};
		let fields = { username: '', password: '', repassword: '', email: '', male: '-1', code: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body);
		// 执行操作---
		let ins = await schema;
		let table = ins.getTable('users');

		// 随机设定头像
		let avatarIdArr = await ins.getTable('avatars').select('id').where('isSystemCreate=1').execute().then(s => formatFetchAll(s));
		if (!avatarIdArr) {
			throw new ApiError(ApiErrorNames.UNKNOW_ERROR, '未知错误');
		}
		let avatarIndex = Math.floor(Math.random() * 6);
		let { id: avatarId } = avatarIdArr[avatarIndex];

		// 构建用户数据
		let { username, password, repassword, email, male } = validParams;
		let keys = ['username', 'password', 'email', 'male', 'avatarId'];
		let values = [username, password, email, male, avatarId];

		// 用户名,密码,邮箱(用于找回密码,首先需要激活邮箱,激活邮箱则可以使用邮箱登录)不可为空
		// 检查用户名是否被使用
		let usernameBeUsed = await table
			.select('id')
			.where(`username=:u`)
			.bind('u', username)
			.execute()
			.then((s) => formatFetch(s));
		if (usernameBeUsed) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '此用户名已被使用');
		}
		// 检查邮箱是否被使用
		let emailBeUsed = await table
			.select('id')
			.where(`email=:u`)
			.bind('u', email)
			.execute()
			.then((s) => formatFetch(s));
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

// 发送邮件验证码
exports.sendcode = async (ctx) => {
	console.log(`请求->用户->发送邮箱: public.sendcode; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	try {
		let body = ctx.request.body || {};
		let fields = { email: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body);
		// 执行操作---
		let ins = await schema;
		let table = ins.getTable('users');

		const { email } = validParams;
		const code = Math.random().toString().slice(2, 6); // 随机生成的验证码

		// 检查邮箱是否被使用
		let emailBeUsed = await table
			.select('id')
			.where(`email=:u`)
			.bind('u', email)
			.execute()
			.then((s) => formatFetch(s));
		if (emailBeUsed) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '此邮箱已被使用'); // 邮箱已被使用
		}
		// 发送验证码
		const res = await sendEmailCode(email, code);
		// 记录验证码
		

		console.log(res)
		ctx.body = true;
	} catch (error) {
		throw new ApiError(ApiErrorNames.UNKNOW_ERROR, error.message);
	}
};

// 用户登录
exports.login = async (ctx) => {
	// var ciphertext = AES.encrypt('adgjmptw123', 'adgjmptw123').toString();
	console.log(`请求->用户->登录: login.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	try {
		let body = ctx.request.body || {};
		let patt = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
		let isEmail = patt.test(body.username); // 判断是否是邮箱
		let fields = isEmail ? { email: '', password: '' } : { username: '', password: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, { ...body, email: body.username });
		// 执行操作---
		let { username, password } = body;

		let ins = await schema;
		let table = ins.getTable('users');
		let userinfo = await table
			.select('id', 'username', 'male', 'avatarId', 'email', 'status', 'createTime', 'updateTime')
			.where(`${isEmail ? 'email' : 'username'}=:u and password=:p`)
			.bind('u', username)
			.bind('p', password)
			.execute()
			.then((s) => formatFetch(s));
		if (!userinfo) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '账户名或密码错误');
		} else {
			let { status } = userinfo;
			if (status === '0') {
				throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户被冻结');
			}
		}
		ctx.session = {
			username: userinfo.username,
			id: userinfo.id,
			email: userinfo.email,
			isLogin: true,
		};
		ctx.body = userinfo;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

exports.logout = async (ctx) => {
	ctx.session = null;
	ctx.body = true;
};


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
// 			.select('id', 'username', 'male', 'avatarId', 'email', 'status', 'createTime', 'updateTime')
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
