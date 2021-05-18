const fs = require('fs');
const path = require('path')

const {
	screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../lib/verify");
const { schema } = require("../lib/mysqlx");
const { formatFetch, formatFetchAll } = require("../lib/utils");

const config = require('./../config');
const { baseUploadsPath, avatarPath, avatarFullPath } = require('../config/upload');
const usersRules = require("../rules/users");

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->用户->查询一条数据: users.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = { id: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, usersRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { id } = validParams;
	let ins = await schema;
	let table = ins.getTable('users');
	let userinfo = await table
		.select('id', 'username', 'male', 'avatarId', 'email', 'emailActive', 'status', 'createTime', 'updateTime')
		.where(`id=:id`)
		.bind('id', id)
		.execute()
		.then(s => formatFetch(s))
	if (!userinfo) {
		return ctx.throw(400, '用户不存在');
	}
	let avatarInfo = await ins.getTable('avatars')
		.select('isSystemCreate', 'fileName', 'createTime')
		.where(`id=:id`)
		.bind('id', userinfo.avatarId)
		.execute()
		.then(s => formatFetch(s))
	let { isSystemCreate, fileName, createTime } = avatarInfo;

	ctx.body = {
		...userinfo,
		isSystemCreate,
		avatarFileName: fileName,
		avatarFullPath: fileName ? (ctx.request.header.host + avatarPath + '/' + fileName) : null,
		avatarCreateTime: createTime
	};
};

// 更新一条用户信息
const updateOne = async (ctx) => {
	console.log(`请求->用户->更新一条数据: users.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = { id: '', male: '', avatarId: '' }; // 校验字段
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, usersRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { id, ...other } = validParams;
	let ins = await schema;
	let table = ins.getTable('users');
	let info = await table.select('id', 'status').where(`id=:u`).bind('u', id).execute().then(s => formatFetch(s))
	if (!info) {
		return ctx.throw(400, '用户不存在');
	} else {
		let { status } = info;
		if (status === '0') {
			return ctx.throw(400, '用户被冻结');
		}
	}
	let updater = Object.keys(other).reduce((total, currentValue) => {
		total.set(currentValue, other[currentValue])
		return total;
	}, table.update().where('id=:id').bind('id', id))
	let result = await updater.execute().then(s => {
		let warningsCount = s.getWarningsCount();
		let AffectedItemsCount = s.getAffectedItemsCount();
		if (warningsCount === 0 && AffectedItemsCount === 1) {
			return true;
		}
		return false;
	})
	ctx.body = result;
};

// 删除用户
// const deleteOneUser = async (ctx) => {

// };

// 用户头像上传
// 参数: id; 用户id
// 参数: file; 头像file
const uploadProfilePicture = async (ctx) => {
	console.log(`请求->用户->用户头像上传: uploadProfilePicture.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {}; // 为空
	let fields = { id: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, usersRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	const file = ctx.request.files.file;
	if (!file) {
		return ctx.throw(400, '用户头像不能为空');
	}
	// 校验完毕, 执行操作---
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['image/png', 'image/jpeg', 'image/gif']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		return ctx.throw(400, '头像只支持' + allowedType.toString() + '格式');
	}
	// 获取到上传文件名
	let fileName = path.basename(filePath);

	// 将用户id,文件名
	let { id: userId } = validParams;
	let keys = ['fileName'];
	let values = [fileName];
	let ins = await schema;
	// 校验该用户是否存在
	let userInfo = await ins.getTable('users').select('id', 'status').where(`id=:u`).bind('u', userId).execute().then(s => formatFetch(s))
	if (!userInfo) {
		return ctx.throw(400, '用户不存在');
	} else {
		let { status } = userInfo;
		if (status === '0') {
			return ctx.throw(400, '用户被冻结');
		}
	}
	// 用户存在, 保存上传记录
	let uploadInfo = await ins.getTable('avatars').insert(keys).values(values).execute();
	let avatarId = uploadInfo.getAutoIncrementValue();
	if (!uploadInfo.getAffectedItemsCount() || !avatarId) {
		return ctx.throw(400, '上传失败');
	}
	// 图片上传成功, 更新用户表记录
	let userUpdateInfo = await ins.getTable('users').update().where('id=:id').bind('id', userId).set('avatarId', avatarId).execute();
	if (!userUpdateInfo.getAffectedItemsCount()) {
		return ctx.throw(400, '上传成功, 但更新失败');
	}
	ctx.body = true;
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
// ctx.body = {
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
