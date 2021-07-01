const jsonwebtoken = require('jsonwebtoken');
const dayjs = require('dayjs');

const { sendEmailCode } = require('../lib/email')
const { instanceTable } = require('../lib/method');
const config = require('../config');

const pathName = '用户';
const pathRoute = 'ordinary';
const rules = {
	username: [{ required: true, message: "用户名不可为空" }, { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/, message: "用户名由2~20位中文、英文、数字和下划线字符组成" }],
	password: [{ required: true, message: "密码不可为空" }],
	repassword: [{ required: true, message: "重复密码不可为空" }],
	male: [{ required: false, message: "" }, { pattern: /[012]/, message: "性别参数错误" }],
	email: [{ required: true, message: "邮箱不可为空", }, { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "邮箱格式错误" }],
	code: [{ required: true, message: "验证码不可为空" }, { pattern: /^\d{4}$/, message: "验证码输入错误" }]
}

// 用户注册
exports.register = async (ctx) => {
	console.log(`请求->${pathName}->注册: ${pathRoute}.register; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let params = ctx.verifyParams({
		username: rules.usename,
		password: rules.password,
		repassword: rules.repassword,
		male: rules.male,
		email: rules.email,
		code: rules.code
	})
	let { usersTable, avatarsTable, registerEmailTable } = await instanceTable();

	let { username, password, repassword, male, email, code } = params;
	// 用户名,密码,邮箱(用于找回密码,首先需要激活邮箱,激活邮箱则可以使用邮箱登录)不可为空
	// 检查邮箱是否被使用
	let emailBeUsed = await usersTable.findOne(`email='${email}'`);
	if (emailBeUsed) {
		return ctx.throw(400, '此邮箱已被使用');
	}
	// 检查用户名是否被使用
	let usernameBeUsed = await usersTable.findOne(`username='${username}'`);
	if (usernameBeUsed) {
		return ctx.throw(400, '此用户名已被使用');
	}
	// 校验用户两次输入密码是否一致
	if (password !== repassword) {
		return ctx.throw(400, '两次输入密码不一致');
	}
	// 搁置:另一种流程思路,只需要这个邮箱对应的最新的验证码
	// 检查邮箱验证码是否存在
	let registerEmail = await registerEmailTable.findAll(`email='${email}' and code=${code}`, ['id', 'expires', 'expiresTime'], 'createTime desc');
	if (!registerEmail || !registerEmail.length) {
		return ctx.throw(400, '验证码错误');
	}
	let { expires } = registerEmail[0]; // 取最新的验证码
	let currentTime = dayjs();
	// 当前时间在过期时间之后
	if (currentTime.isAfter(dayjs(expires))) {
		return ctx.throw(400, '验证码已过期, 请重新获取');
	}
	// 随机设定头像
	let avatarIdArr = await avatarsTable.findAll('isSystemCreate=1');
	if (!avatarIdArr || !avatarIdArr.length) {
		return ctx.throw(400, '未知错误, 未查询出系统头像');
	}
	let avatarIndex = Math.floor(Math.random() * avatarIdArr.length);
	let { id: avatarId } = avatarIdArr[avatarIndex];
	// 构建用户数据
	let keys = ['username', 'password', 'email', 'male', 'avatarId'];
	let values = { username, password, email, male, avatarId };
	// 插入数据库,注册成功后删除注册验证码
	let result = await usersTable.addOne(keys, values);
	if (result) {
		let ids = registerEmail.map(i => i.id).toString();
		await registerEmailTable.deleteMultiple(`id IN (${ids})`)
	}
	ctx.bodys = result;
};

// 发送邮件验证码
exports.sendcode = async (ctx) => {
	console.log(`请求->${pathName}->发送邮箱: ${pathRoute}.sendcode; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let params = ctx.verifyParams({
		email: rules.email,
	})
	let { usersTable, avatarsTable, registerEmailTable } = await instanceTable();
	const { email } = params;
	const code = Math.random().toString().slice(2, 6); // 随机生成的验证码
	// 检查邮箱是否被使用
	let emailBeUsed = await usersTable.findOne(`email='${email}'`);
	if (emailBeUsed) {
		return ctx.throw(400, '此邮箱已被使用');
	}
	// 检查是否频繁操作, 将用户操作计入session;
	let currentTime = dayjs();
	let { sendTime = '', count = 0 } = ctx.session.emailBehavior || {};
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
	ctx.session.emailBehavior = { sendTime: currentTime.valueOf(), sendTimeFormat: currentTime.format(), count }
	// 发送验证码
	await sendEmailCode(email, code);
	// 记录验证码到数据库
	let expires = currentTime.add(30, 'minute');
	let keys = ['email', 'code', 'expires', 'expiresTime']
	let values = { email, code, expires: expires.valueOf(), expiresTime: expires.format() };
	let result = await registerEmailTable.addOne(keys, values)
	ctx.bodys = result;
};
// 用户登录
exports.login = async (ctx) => {
	console.log(`请求->${pathName}->登录: ${pathRoute}.login; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	// TODO:是否记录用户操作记录
	// TODO:是否设置登录频繁操作的验证
	let body = ctx.request.body || {};
	let patt = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
	let isEmail = patt.test(body.username); // 判断是否是邮箱
	let rule = {
		username: isEmail ? rules.email : rules.username,
		password: rules.password,
	}
	let params = ctx.verifyParams(rule);
	let { usersTable, avatarsTable, registerEmailTable } = await instanceTable();
	let { username, password } = params;
	let user = await usersTable.findOne(`${isEmail ? 'email' : 'username'}='${username}' and password='${password}'`, ['id', 'email', 'username', 'createTime', 'updateTime']);
	if (!user) {
		return ctx.throw(403, '用户名或密码错误')
	}
	ctx.bodys = {
		user,
		token: jsonwebtoken.sign(
			{ userId: user.id, username: user.username, email: user.email },  // 加密userToken
			config.SECRET, // 加密密钥
			{ expiresIn: '7d' } // 过期时间
		),
	};
};

// 退出登录
exports.logout = async (ctx) => {
	ctx.session = null;
	ctx.bodys = true;
};
