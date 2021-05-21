const fs = require('fs');
const { isArray } = require('../lib/utils')
const { getTable, verifyUserStatus } = require('../method');
const accountsRules = require("../rules/accounts");
// TODO:缺一个类型校验和转化
// ...

let keyField = {
	id: '',
	userId: '', // 所属用户id
}
let paramFields = {
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
	let session = ctx.session || {};
	// 接口参数字段
	let fields = paramFields;
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	let values = { ...validParams, userId: session.userId };
	// 执行操作---
	let { accountsTable } = await getTable();
	let keys = Object.keys(parmas); // 数组
	let result = await accountsTable.addOne(keys, values);
	ctx.bodys = result;
};
// 同时插入多条数据
const addMultiple = async (ctx) => {
	console.log(`请求->账户->添加多条数据: accounts.addMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = paramFields;
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = body.map(item => {
		return ctx.valid(fields, item, accountsRules);
	})
	let values = validParams.map(i => ({ ...i, userId: session.userId }))
	// 执行操作---
	let { accountsTable } = await getTable();
	let keys = Object.keys(fields); // 数组
	let result = await accountsTable.addMultiple(keys, values);
	ctx.bodys = result;
}

// 查询
// 查找-指定ID查找账户信息
const findOne = async (ctx) => {
	console.log(`请求->账户->查询数据详细信息: accounts.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { id: '' };
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	// 校验通过, 执行操作---
	let { accountsTable } = await getTable();

	let { userId } = session;
	let { id } = validParams;
	// 这里使用了userId辅助精确删除, 但是当admin等管理员删除时会存在问题, 可能需要做一个权限的判断之类的
	let where = `id=${id} and userId=${userId}`;
	let selects = []; // 查询全部
	let result = await accountsTable.findOne(where, selects);
	ctx.bodys = result;
};
// 查找-多条数据(根据userId找到该用户下的账户数据, 可分页)
const findMultiple = async (ctx) => {
	console.log(`请求->账户->查询用户的账户列表: accounts.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { pageNum: 1, pageSize: 10 };
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	// 执行操作---
	let { accountsTable } = await getTable();
	let { userId } = session;
	let { pageNum, pageSize } = validParams;
	let where = `userId=${userId}`;
	let selects = [];
	let result = await accountsTable.findMultiple(where, selects, pageNum, pageSize);
	ctx.bodys = result;
};
// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->账户->查询用户全部账户数据: accounts.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 执行操作---
	let { accountsTable } = await getTable();
	let { userId } = session;
	let result = await accountsTable.findAll(`userId=${userId}`);
	ctx.bodys = result
};

// 更新
// 更新一条账户信息
const updateOne = async (ctx) => {
	console.log(`请求->账户->更新一条数据: accounts.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { id: '', ...paramFields };
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	let values = { ...validParams, userId: session.userId };
	// 执行操作---
	let { accountsTable } = await getTable();
	let { id, userId } = values;
	let where = `id=${id} and userId=${userId}`;
	// 校验是否存在于数据库中
	let info = await accountsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	// 插入
	let result = await accountsTable.updateOne(where, values);
	ctx.bodys = result;
};
// 更新多条账户信息
const updateMultiple = async (ctx) => {
	console.log(`请求->账户->更新多条数据: accounts.updateMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { id: '', ...paramFields };
	// 获取参数
	let body = ctx.arguments();
	if (!isArray(body)) {
		return ctx.throw(400, '参数错误, 期望JSON数组');
	}
	// 校验参数并返回有效参数
	let validParams = body.map(item => {
		return ctx.valid(fields, item, accountsRules);
	})
	let { userId } = ctx.userinfo();
	let values = validParams.map(i => ({ ...i, userId: session.userId }))
	// 执行操作---
	let { accountsTable } = await getTable();
	let where = `userId=${userId} and`; // id校验, 不能让用户乱传id和userId
	let result = await accountsTable.updateMultiple('id', where, values);
	ctx.bodys = result;
}

// 删除
// 删除一条数据
const deleteOne = async (ctx) => {
	console.log(`请求->账户->删除一条数据: accounts.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { id: '' };
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	// 执行操作---
	let { userId } = session;
	let { id } = validParams;
	let { accountsTable } = await getTable();
	let where = `id=${id} and userId=${userId}`;
	// 检查数据是否存在
	let info = await accountsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	// 如果存在, 则删除
	let result = await accountsTable.deleteOne(where);
	ctx.bodys = result;
};
// 删除多条数据
const deleteMultiple = async (ctx) => {
	console.log(`请求->账户->删除一条数据: accounts.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	let fields = { ids: '' };
	// 获取参数
	let body = ctx.arguments();
	// 校验参数并返回有效参数
	let validParams = ctx.valid(fields, body, accountsRules);
	// 执行操作---
	let { userId } = session;
	let { ids } = validParams;
	// 这里需要校验用户是否有权限删除数据, 防止用户删除其他用户的数据
	// --分割线--
	let { accountsTable } = await getTable();
	// 开始删除
	// DELETE FROM accounts WHERE id IN (17,18) and userId = 87;
	// let result = await accountsTable.deleteMultiple(`id IN (${ids}) and userId=${ctx.session.id}`);
	let result = await accountsTable.deleteOne(`userId=${userId} and id IN (${ids})`);
	ctx.bodys = result;
};

// 导入json文件
const importJSONFile = async (ctx) => {
	console.log(`请求->用户->JSON文件上传: accounts.importJSONFile; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let session = ctx.session || {};
	// 接口参数字段
	// let fields = { userId: '' };
	// // 获取参数
	// let body = ctx.arguments();
	// // 校验参数并返回有效参数
	// let validParams = ctx.valid(fields, body, accountsRules);
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
	let { userId } = session; // 获取用户id, 组装数据
	let str = fs.readFileSync(filePath);
	let fileData = [];
	try {
		fs.unlinkSync(filePath);
		fileData = JSON.parse(str);
		if (!isArray(fileData)) {
			return ctx.throw(400, '参数错误, 期望JSON数组');
		}
		if (!fileData.length) {
			return ctx.throw(400, '没有可导入的数据');
		}
	} catch (error) {
		return ctx.throw(400, error);
	}
	let { accountsTable } = await getTable();
	let values = fileData.map(item => {
		return { ...item, userId }
	})
	let keys = Object.keys(values[0]);
	let result = await accountsTable.addMultiple(keys, values);
	ctx.bodys = result;
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
