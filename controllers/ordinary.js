const dayjs = require('dayjs')
const jsonwebtoken = require('jsonwebtoken');

const config = require('../config')
const { schema } = require('../lib/mysqlx');
const {
	screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../lib/verify");
const usersRules = require("../rules/users");
const { sendEmailCode } = require('../lib/email')
const { formatFetch, formatFetchAll } = require('../lib/utils');
const Table = require('../lib/usersTable');
// var AES = require("crypto-js/aes");

// // AES加密 加密用户网站密码
// let ciphertext = CryptoJS.AES.encrypt('123456', '123456').toString();
// let plaintext = CryptoJS.AES.decrypt(ciphertext, '123456').toString(CryptoJS.enc.Utf8);
// console.log(ciphertext, plaintext)

// // sha256加密 加密用户登录密码, 用户密码为密钥key
// CryptoJS.SHA256('123456', '123456').toString()
// let ins = await schema;

async function getTable() {
	let ins = await schema;
	let usersTable = ins.getTable('users');
	let avatarsTable = ins.getTable('avatars');
	let registerEmailTable = ins.getTable('registeremail');
	return {
		usersTable, avatarsTable, registerEmailTable
	}
}

// 用户注册
exports.register = async (ctx) => {
	console.log(`请求->用户->注册: ordinary.register; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let body = ctx.request.body || {};
	let fields = { username: '', password: '', repassword: '', male: '2', email: '', code: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, usersRules);
	if (errors.length > 0) {
		ctx.throw(400, errors[0]);
	}
	// 执行操作---
	let { usersTable, avatarsTable, registerEmailTable } = await getTable();

	let { username, password, repassword, male, email, code } = validParams;
	// 用户名,密码,邮箱(用于找回密码,首先需要激活邮箱,激活邮箱则可以使用邮箱登录)不可为空
	// 检查邮箱是否被使用
	let emailBeUsed = await usersTable
		.select('id')
		.where(`email=:e`)
		.bind('e', email)
		.execute()
		.then((s) => formatFetch(s));
	if (emailBeUsed) {
		return ctx.throw(400, '此邮箱已被使用');
	}
	// 检查用户名是否被使用
	let usernameBeUsed = await usersTable
		.select('id')
		.where(`username=:u`)
		.bind('u', username)
		.execute()
		.then((s) => formatFetch(s));
	if (usernameBeUsed) {
		return ctx.throw(400, '此用户名已被使用');
	}
	// 校验用户两次输入密码是否一致
	if (password !== repassword) {
		return ctx.throw(400, '两次输入密码不一致');
	}
	// 搁置:另一种流程思路,只需要这个邮箱对应的最新的验证码
	// 检查邮箱验证码是否正确
	let registerEmail = await registerEmailTable
		.select('id', 'expires', 'expiresTime')
		.where(`email=:email and code=:code`)
		.bind('email', email)
		.bind('code', code)
		.execute()
		.then((s) => formatFetch(s));
	if (!registerEmail) {
		return ctx.throw(400, '验证码错误');
	}
	let { id: registerEmailId, expires } = registerEmail;
	let currentTime = dayjs();
	// 当前时间在过期时间之后
	if (currentTime.isAfter(dayjs(expires))) {
		return ctx.throw(400, '验证码已过期, 请重新获取');
	}
	// 随机设定头像
	let avatarIdArr = await avatarsTable.select('id').where('isSystemCreate=1').execute().then(s => formatFetchAll(s));
	if (!avatarIdArr) {
		return ctx.throw(400, '未知错误, 未查询出系统头像');
	}
	let avatarIndex = Math.floor(Math.random() * 6);
	let { id: avatarId } = avatarIdArr[avatarIndex];
	// 构建用户数据
	let keys = ['username', 'password', 'email', 'male', 'avatarId'];
	let values = [username, password, email, male, avatarId];
	// 插入数据库,注册成功后删除注册验证码
	let result = await usersTable.insert(keys).values(values).execute().then(async s => {
		let affectCount = s.getAffectedItemsCount();
		if (affectCount === 1) {
			return await registerEmailTable.delete().where('id=:id').bind('id', registerEmailId).execute().then(s => {
				let count = s.getAffectedItemsCount();
				return count ? true : false
			})
		}
		return false;
	});
	ctx.session.email = {};
	ctx.body = result;
};

// 发送邮件验证码
exports.sendcode = async (ctx) => {
	console.log(`请求->用户->发送邮箱: ordinary.sendcode; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	console.log(ctx.session.email)
	let body = ctx.request.body || {};
	let fields = { email: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, usersRules);
	if (errors.length > 0) {
		ctx.throw(400, errors[0]);
	}
	// 执行操作---
	let { usersTable, avatarsTable, registerEmailTable } = await getTable();

	const { email } = validParams;
	const code = Math.random().toString().slice(2, 6); // 随机生成的验证码
	// 检查邮箱是否被使用
	let emailBeUsed = await usersTable.select('id')
		.where(`email=:e`)
		.bind('e', email)
		.execute()
		.then((s) => formatFetch(s));
	if (emailBeUsed) {
		return ctx.throw(400, '此邮箱已被使用');
	}
	// 检查是否频繁操作, 将用户操作计入session;
	let currentTime = dayjs();
	let { sendTime = '', count = 0 } = ctx.session.email || {};
	// 暂时不用count
	// count++;
	// if (count >= 5) {
	// 	throw new ApiError(ApiErrorNames.UNKNOW_ERROR, '操作频繁');
	// }
	if (sendTime) {
		if (dayjs(sendTime).isAfter(dayjs(currentTime).subtract(60, 'second'))) {
			return ctx.throw(400, '操作频繁');
		}
	}
	ctx.session.email = { sendTime: currentTime.valueOf(), sendTimeFormat: currentTime.format(), count }
	// 发送验证码
	await sendEmailCode(email, code);
	// 记录验证码到数据库
	let expires = currentTime.add(30, 'minute');
	let keys = ['email', 'code', 'expires', 'expiresTime']
	let values = [email, code, expires.valueOf(), expires.format()];
	let res = await registerEmailTable.insert(keys).values(values).execute();
	// 结束
	ctx.body = true;
};

// 用户登录
exports.login = async (ctx) => {
	let usersTable = await Table.build('users')
	let userinfo = await usersTable.findOne(`id=${87}`)
	console.log(userinfo)
	ctx.body = true;

	// // var ciphertext = AES.encrypt('adgjmptw123', 'adgjmptw123').toString();
	// console.log(`请求->用户->登录: login.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	// // 是否设置登录频繁操作的验证
	// // .....
	// let body = ctx.request.body || {};
	// let patt = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
	// let isEmail = patt.test(body.username); // 判断是否是邮箱
	// let fields = isEmail ? { email: '', password: '' } : { username: '', password: '' };
	// // 校验参数并返回有效参数
	// let { errors, validParams } = verifyParams(fields, { ...body, email: body.username }, usersRules);
	// if (errors.length > 0) {
	// 	ctx.throw(400, errors[0]);
	// }
	// let { password } = validParams;
	// let username = validParams.username || validParams.email;
	// // 执行操作---
	// let { usersTable, avatarsTable, registerEmailTable } = await getTable();

	// let userinfo = await usersTable
	// 	.select('id', 'username', 'male', 'avatarId', 'email', 'status', 'createTime', 'updateTime')
	// 	.where(`${isEmail ? 'email' : 'username'}=:u and password=:p`)
	// 	.bind('u', username)
	// 	.bind('p', password)
	// 	.execute()
	// 	.then((s) => formatFetch(s));
	// if (!userinfo) {
	// 	return ctx.throw(400, '账户名或密码错误');
	// } else {
	// 	let { status } = userinfo;
	// 	if (status === '0') {
	// 		return ctx.throw(400, '用户被冻结');
	// 	}
	// }
	// ctx.state.user = {
	// 	username: userinfo.username,
	// 	id: userinfo.id,
	// 	email: userinfo.email,
	// }
	// ctx.session = {
	// 	username: userinfo.username,
	// 	id: userinfo.id,
	// 	email: userinfo.email,
	// 	isLogin: true,
	// };
	// ctx.body = {
	// 	user: userinfo,
	// 	token: jsonwebtoken.sign(
	// 		{ name: userinfo.username, email: userinfo.email, id: userinfo.id },  // 加密userToken
	// 		config.SECRET,
	// 		{ expiresIn: '7d' }
	// 	),
	// };
};

exports.logout = async (ctx) => {
	ctx.session = null;
	ctx.body = true;
};
