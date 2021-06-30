const fs = require('fs');
const path = require('path')
const { instanceTable } = require('../lib/method');
const { upload } = require("../config")

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->用户->查询一条数据: users.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let { userId } = ctx.session.user || {};
	let { usersTable, avatarsTable } = await instanceTable();
	let where = `id=${userId}`;
	let selects = ['id', 'email', 'username', 'male', 'avatarId', 'active', 'status', 'role', 'createTime', 'updateTime']; // 查询全部
	let userinfo = await usersTable.findOne(where, selects);
	let { avatarId } = userinfo;
	let avatarInfo = await avatarsTable.findOne(`id=${avatarId}`, ['fileName', 'isSystemCreate']);
	if (!avatarInfo) {
		return ctx.throw(500, '用户头像为空, 系统异常')
	}
	let { isSystemCreate, fileName } = avatarInfo;
	let { defaultAvatarName, avatarName } = upload;
	// uploadsName upload静态文件目录, 不需要拼接这个目录, 直接接口+其下文件地址
	let avatarFullPath = `${ctx.request.header.host}/${isSystemCreate ? defaultAvatarName : avatarName}/${fileName}`;

	let result = {
		...userinfo,
		...avatarInfo,
		avatarFullPath,
	}
	ctx.bodys = result;
};

// 更新一条用户信息
const updateOne = async (ctx) => {
	console.log(`请求->用户->更新一条数据: users.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		male: [{ required: false, message: "" }, { pattern: /[012]/, message: "性别参数错误" }],
	})
	let { userId } = ctx.session.user || {};
	let { usersTable } = await instanceTable();
	let where = `id=${userId}`;
	let info = await usersTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	let result = await usersTable.updateOne(where, params);
	ctx.bodys = result;
};

// 用户头像上传
// 参数: id; 用户id
// 参数: file; 头像file
const uploadProfilePicture = async (ctx) => {
	console.log(`请求->用户->用户头像上传: uploadProfilePicture.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let { userId } = ctx.session.user || {};
	const file = ctx.request.files.file;
	if (!file) {
		return ctx.throw(400, '用户头像不能为空');
	}
	// 初步校验通过, 执行操作---
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['image/png', 'image/jpeg', 'image/gif']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		return ctx.throw(400, '头像只支持' + allowedType.toString() + '格式');
	}
	// 获取到上传文件
	let fileName = path.basename(filePath);
	// 将头像移动到头像目录
	let oldPath = filePath;
	let newPath = path.resolve(upload.avatarPath, '2', fileName)
	try {
		fs.renameSync(oldPath, newPath);
	} catch (error) {
		fs.unlinkSync(oldPath)
		return ctx.throw(500, error)
	}

	// 将用户id,文件名存入数据库
	let { usersTable, avatarsTable } = await instanceTable();
	let values = { fileName };
	let keys = Object.keys(values); // 数组
	let avatarId = await avatarsTable.addOne(keys, values);
	if (!avatarId) {
		return ctx.throw(500, '系统异常')
	} else {
		fs.unlinkSync(newPath)
	}
	let where = `id=${userId}`;
	let result = await usersTable.updateOne(where, { avatarId });
	if (!result) {
		fs.unlinkSync(newPath)
	}
	ctx.bodys = result;
}
module.exports = {
	updateOne,
	findOne,
	uploadProfilePicture
}

