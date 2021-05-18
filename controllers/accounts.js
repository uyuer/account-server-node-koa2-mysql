const fs = require('fs');
const path = require('path')
const formidable = require('formidable');

const {
	screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../lib/verify");
const { session, schema } = require("../lib/mysqlx");
const { formatFetch, formatFetchAll, isArray } = require("../lib/utils");

const config = require('./../config');
const { baseUploadsPath, avatarPath, avatarFullPath } = require('../config/upload');
const accountsRules = require("../rules/accounts");
const Table = require('../lib/usersTable');

async function getTable() {
	let ins = await schema;
	let usersTable = await Table.build('users');
	let avatarsTable = await Table.build('avatars');
	let registerEmailTable = await Table.build('registeremail');
	let accountsTable = await Table.build('accounts');
	return {
		usersTable, avatarsTable, registerEmailTable, accountsTable
	}
}
// let arr = ['id', 'userId', 'site', 'website', 'introduction', 'account', 'password', 'associates', 'nickname', 'status', 'remark', 'tags', 'createTime', 'updateTime']

// TODO:缺一个类型校验和转化
// ...

let tableFields = {
	userId: '', // 所属用户id
	site: '', // 网站名称
	website: '', // 网站地址
	introduction: '', // 网站简介, 可以添加一些说明文字
	account: '', // 注册账户(在网站注册的时候使用的账户)
	password: '', // 加密密码(使用AES加密, 需要密钥来解密)
	associates: '', // 绑定或关联的账户(注册账户关联或绑定的账户)可能有多个关联(字符串数组形式)
	nickname: '', // 网站上的昵称
	status: '0', // 状态(0:正常,1:停用,2:注销)
	remark: '', // 备注
	tags: '', // 标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)
};
// 插入
// 添加一条数据
const addOne = async (ctx) => {
	console.log(`请求->账户->添加一条数据: accounts.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = tableFields;
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let keys = Object.keys(fields); // 数组
	let { accountsTable } = await getTable();
	let info = await accountsTable.addOne(keys, validParams);
	ctx.body = true;
};
// 同时插入多条数据
const addMultiple = async (ctx) => {
	console.log(`请求->账户->添加多条数据: accounts.addMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = tableFields;
	// 校验参数并返回有效参数
	let validParams = body.map(item => {
		let { errors, validParams: params } = verifyParams(fields, item, accountsRules);
		if (errors.length > 0) {
			return ctx.throw(400, errors[0]);
		}
		return params;
	})
	// 校验完毕, 执行操作---
	let keys = Object.keys(fields); // 数组
	let { accountsTable } = await getTable();
	let info = await accountsTable.addMultiple(keys, validParams);
	ctx.body = info;
}

// 查询
// 查找-指定ID查找账户信息
const findOne = async (ctx) => {
	console.log(`请求->账户->查询数据详细信息: accounts.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = { id: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { id } = validParams;
	let { accountsTable } = await getTable();
	let info = await accountsTable.findOne(`id=${id}`, []);
	ctx.body = info;
};
// 查找-多条数据(根据userId找到该用户下的账户数据, 可分页)
const findMultiple = async (ctx) => {
	console.log(`请求->账户->查询用户的账户列表: accounts.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = { userId: '', pageNum: 1, pageSize: 10 };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { userId, pageNum, pageSize } = validParams;
	let { accountsTable } = await getTable();
	let list = await accountsTable.findMultiple(`userId=${userId}`, [], pageNum, pageSize);
	ctx.body = list;
};
// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->账户->查询用户全部账户数据: accounts.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = { userId: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { userId } = validParams;
	// 查询
	let { accountsTable } = await getTable();
	let list = await accountsTable.findAll(`userId=${userId}`);
	ctx.body = list
};

// 更新
// 更新一条账户信息
const updateOne = async (ctx) => {
	console.log(`请求->账户->更新一条数据: accounts.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = { id: '', ...tableFields };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { id, userId, ...other } = validParams;
	let where = `id=${id} and userId=${userId}`;
	// 校验是否存在于数据库中
	let { accountsTable } = await getTable();
	let info = await accountsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	// 插入
	let result = await accountsTable.updateOne(where, other);
	ctx.body = result;
};
// 更新多条账户信息
const updateMultiple = async (ctx) => {
	console.log(`请求->账户->更新多条数据: accounts.updateMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = { id: '', ...tableFields };
	if (!isArray(body)) {
		return ctx.throw(400, '参数类型错误, 期望字符串数组');
	}
	// 校验
	let validParams = body.map(item => {
		let { errors, validParams: params } = verifyParams(fields, item, accountsRules);
		if (errors.length > 0) {
			return ctx.throw(400, errors[0]);
		}
		return params;
	})
	// TODO: id校验, 不能让用户乱传id和userId
	// 执行操作
	let { accountsTable } = await getTable();
	let result = await accountsTable.updateMultiple('id', validParams);
	ctx.body = result;
}

// 删除
// 删除一条数据
const deleteOne = async (ctx) => {
	console.log(`请求->账户->删除一条数据: accounts.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = { id: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { id } = validParams;
	// 校验是否存在于数据库中
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');
	// 检查数据是否存在
	let info = await accountsTable.select('id').where(`id=:id`).bind('id', id).execute().then(s => formatFetch(s))
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	// 如果存在, 则删除
	let result = await accountsTable.delete().where(`id=:id`).bind('id', id).execute().then(s => {
		let count = s.getAffectedItemsCount();
		return count ? true : false
	})
	ctx.body = result;
};
// 删除多条数据
const deleteMultiple = async (ctx) => {
	console.log(`请求->账户->删除一条数据: accounts.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = { ids: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 校验完毕, 执行操作---
	let { ids } = validParams;
	// 校验是否存在于数据库中
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');

	// delete from accounts where id in ('20','24')
	let sql = `
		DELETE FROM ${accountsTable.getSchema().getName()}.${accountsTable.getName()} WHERE id IN (${ids})
		`;
	let result = await accountsTable.getSession().sql(sql).execute().then(s => {
		let warningsCount = s.getWarningsCount();
		let affectCount = s.getAffectedItemsCount();
		if (affectCount > 0) {
			return true;
		}
		return false;
	})
	ctx.body = result;
};

// 导入json文件
const importJSONFile = async (ctx) => {
	console.log(`请求->用户->JSON文件上传: accounts.importJSONFile; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {}; // 为空
	let fields = { userId: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, accountsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	const file = ctx.request.files.file;
	if (!file) {
		return ctx.throw(400, '导入文件不能为空');
	}
	// 校验完毕, 执行操作---
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['application/json']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		return ctx.throw(400, '只支持导入文件为' + allowedType.toString() + '格式');
	}
	let dataStr = fs.readFileSync(filePath);
	const data = JSON.parse(dataStr)
	// console.log("同步读取: " + data);
	console.log(ctx.session)
	// console.log(path.resolve('./tmp'))
	// // 获取到上传文件名
	// let fileName = path.basename(filePath);

	// // 将用户id,文件名
	// let { id: userId } = validParams;
	// let keys = ['fileName'];
	// let values = [fileName];
	// let ins = await schema;
	// // 校验该用户是否存在
	// let userInfo = await ins.getTable('users').select('id', 'status').where(`id=:u`).bind('u', userId).execute().then(s => formatFetch(s))
	// if (!userInfo) {
	// 	throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户不存在');
	// } else {
	// 	let { status } = userInfo;
	// 	if (status === '0') {
	// 		throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户被冻结');
	// 	}
	// }
	// // 用户存在, 保存上传记录
	// let uploadInfo = await ins.getTable('avatars').insert(keys).values(values).execute();
	// let avatarId = uploadInfo.getAutoIncrementValue();
	// if (!uploadInfo.getAffectedItemsCount() || !avatarId) {
	// 	throw new ApiError(ApiErrorNames.UNKNOW_ERROR, '上传失败');
	// }
	// // 图片上传成功, 更新用户表记录
	// let userUpdateInfo = await ins.getTable('users').update().where('id=:id').bind('id', userId).set('avatarId', avatarId).execute();
	// if (!userUpdateInfo.getAffectedItemsCount()) {
	// 	throw new ApiError(ApiErrorNames.UNKNOW_ERROR, '上传成功, 但更新失败');
	// }
	ctx.body = true;
}
module.exports = {
	addOne,
	addMultiple,
	findOne,
	findMultiple,
	findAll,
	updateOne,
	updateMultiple,
	deleteOne,
	deleteMultiple,
	importJSONFile,
}
