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

// let arr = ['id', 'userId', 'site', 'website', 'introduction', 'account', 'password', 'associates', 'nickname', 'status', 'remark', 'tags', 'createTime', 'updateTime']
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
	// 执行操作---
	let keys = Object.keys(validParams); // 数组
	let values = keys.map(key => validParams[key]) // 数组

	let ins = await schema;
	let accountsTable = ins.getTable('accounts');
	let res = await accountsTable.insert(keys).values(values).execute();
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
	// 执行操作---
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');

	let keys = Object.keys(fields);
	let inserter = validParams.reduce((total, currentValue) => {
		let values = Object.keys(currentValue).map(key => {
			return currentValue[key]
		})
		total.values(values);
		return total;
	}, accountsTable.insert(keys))
	let result = await inserter.execute().then(s => {
		let warningsCount = s.getWarningsCount();
		if (warningsCount === 0) {
			return true;
		}
		return false;
	})
	ctx.body = result;
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
	// 执行操作---
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');

	let { id } = validParams;

	let userinfo = await accountsTable
		.select()
		.where(`id=:id`)
		.bind('id', id)
		.execute()
		.then(s => formatFetch(s))
	ctx.body = userinfo;
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
	// 执行操作---
	let { userId, pageNum, pageSize } = validParams;

	let ins = await schema;
	let accountsTable = ins.getTable('accounts');
	let totalCount = await accountsTable
		.select()
		.where(`userId=:userId`)
		.bind('userId', userId)
		.execute()
		.then((res => {
			let all = res.fetchAll();
			let arr = Array(...all)
			return arr.length || 0;
		})) || 0
	let userinfo = await accountsTable
		.select()
		.where(`userId=:userId`)
		.bind('userId', userId)
		.limit(pageSize)
		.offset((pageNum - 1) * pageSize)
		.execute()
		.then(s => formatFetchAll(s))
	ctx.body = {
		data: userinfo,
		pageNum: Number(pageNum),
		pageSize: Number(pageSize),
		totalCount
	}
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
	// 执行操作---
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');

	let { userId } = validParams;

	let userinfo = await accountsTable
		.select()
		.where(`userId=:userId`)
		.bind('userId', userId)
		.execute()
		.then(s => formatFetchAll(s))
	ctx.body = {
		data: userinfo,
		totalCount: userinfo.length,
	}

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
	// 执行操作---
	let { id, userId, ...other } = validParams;
	// 校验是否存在于数据库中
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');
	let info = await accountsTable.select('id').where(`id=:id`).bind('id', id).execute().then(s => formatFetch(s))
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}

	// 构建插入数据
	let updater = Object.keys(other).reduce((total, currentValue) => {
		total.set(currentValue, other[currentValue])
		return total;
	}, accountsTable.update().where('id=:id and userId=:userId').bind('id', id).bind('userId', userId))
	let result = await updater.execute().then(s => {
		let warningsCount = s.getWarningsCount();
		let affectCount = s.getAffectedItemsCount();
		if (warningsCount === 0) {
			return true;
		}
		return false;
	})
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
	// 执行操作
	let ins = await schema;
	let accountsTable = ins.getTable('accounts');

	let ids = [];
	let obj = validParams.reduce((total, currentValue, index, arr) => {
		let { id, userId, ...validParams } = currentValue;
		ids.push(id);
		Object.keys(validParams).forEach(key => {
			total[key] ? total[key].push(validParams[key]) : total[key] = [validParams[key]]
		})
		return total;
	}, {})
	let snippet = Object.keys(obj).map((key) => {
		let arr = obj[key];
		let fieldsArr = arr.map((item, index) => {
			return `WHEN ${ids[index]} THEN '${item}'`
		})
		return `${key} = CASE id ${fieldsArr.join(' ')} END`;
	})
	let sql = `
			UPDATE ${accountsTable.getSchema().getName()}.${accountsTable.getName()} SET ${snippet.join(',')} WHERE id IN (${ids.toString()})
		`;
	console.log(sql)
	let result = await accountsTable.getSession().sql(sql).execute().then(s => {
		let warningsCount = s.getWarningsCount();
		let affectCount = s.getAffectedItemsCount();
		if (warningsCount === 0) {
			return true;
		}
		return false;
	})
	ctx.body = result
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
	// 执行操作---
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
	// 执行操作---
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
	// 执行操作---
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
