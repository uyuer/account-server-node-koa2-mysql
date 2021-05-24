const fs = require('fs');
const path = require('path')
const { isArray } = require('../lib/utils')
const { instanceTable } = require('../lib/method');

const {
	screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../useless/verify");
const { schema } = require("../lib/mysqlx");
const { formatFetch, formatFetchAll } = require("../lib/utils");

const config = require('./../config');
const { avatarName } = require('../config/upload');
const usersRules = require("../rules/users");
const { upload } = require("../config")

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->用户->查询一条数据: users.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let { id: userId } = ctx.session.user || {};
	// ---分隔线---
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
	let { id: userId } = ctx.session.user || {};
	// ---分隔线---
	let { usersTable } = await instanceTable();
	let where = `id=${userId}`;
	// 校验是否存在于数据库中
	let info = await usersTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	// 插入
	let result = await usersTable.updateOne(where, params);
	ctx.bodys = result;
};

// 用户头像上传
// 参数: id; 用户id
// 参数: file; 头像file
const uploadProfilePicture = async (ctx) => {
	console.log(`请求->用户->用户头像上传: uploadProfilePicture.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	// try {
	let { id: userId } = ctx.session.user || {};
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
// console.log()
// 读取文件
// let res = fs.readFileSync(filePath);
// console.log(Buffer.isBuffer(res))
// console.log(res.toJSON())
// ctx.bodys = {
// 	name: '头像上传',
// 	res: res.toJSON(),
// }
// fs.renameSync(path, avatarFullPath + '/' + 'a.png') // 重命名弃用

// // 新增用户
// // 插入用户只需要几个必选参数, 其他为可选
// const insertUser = async (ctx) => {

// };

// // 查找-多条件查找用户(暂时不多条件)
// const findMultipleUser = async (ctx) => {

// };
