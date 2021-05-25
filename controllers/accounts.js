const fs = require('fs');
const { isArray } = require('../lib/utils')
const { instanceTable } = require('../lib/method');

// 插入
// 添加一条数据
const addOne = async (ctx) => {
	console.log(`请求->账户->添加一条数据: accounts.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		site: [{ required: false, message: "" }],
		website: [{ required: true, message: "网址不可为空" }, { pattern: /^[a-zA-z]+:\/\/[^\s]*$/, message: "请输入正确的网址" }],
		introduction: [{ required: false, message: "" }],
		account: [{ required: true, message: "账号不可为空" }],
		password: [{ required: false, message: "" }],
		associates: [{ required: false, message: "" }],
		nickname: [{ required: false, message: "" }],
		status: [{ required: false, message: "" }, { pattern: /[012]/, message: "状态参数错误" }],
		remark: [{ required: false, message: "" }],
		tags: [{ required: false, message: "" }], // 数组字符串
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let values = { ...params, userId };
	let keys = Object.keys(values); // 数组
	let result = await accountsTable.addOne(keys, values);
	ctx.bodys = result;
};

// 同时插入多条数据
const addMultiple = async (ctx) => {
	console.log(`请求->账户->添加多条数据: accounts.addMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams([{
		site: [{ required: false, message: "" }],
		website: [{ required: true, message: "网址不可为空" }, { pattern: /^[a-zA-z]+:\/\/[^\s]*$/, message: "请输入正确的网址" }],
		introduction: [{ required: false, message: "" }],
		account: [{ required: true, message: "账号不可为空" }],
		password: [{ required: false, message: "" }],
		associates: [{ required: false, message: "" }],
		nickname: [{ required: false, message: "" }],
		status: [{ required: false, message: "" }, { pattern: /[012]/, message: "状态参数错误" }],
		remark: [{ required: false, message: "" }],
		tags: [{ required: false, message: "" }], // 数组字符串
	}])
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let values = params.map(i => ({ ...i, userId }))
	let keys = Object.keys(values[0]); // 数组
	let result = await accountsTable.addMultiple(keys, values);
	ctx.bodys = result;
}

// 查询
// 查找-指定ID查找账户信息
const findOne = async (ctx) => {
	console.log(`请求->账户->查询数据详细信息: accounts.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	// 这里使用了userId辅助精确删除, 但是当admin等管理员删除时会存在问题, 可能需要做一个权限的判断之类的
	let { id } = params;
	let where = `id=${id} and userId=${userId}`;
	let selects = []; // 查询全部
	let result = await accountsTable.findOne(where, selects);
	ctx.bodys = result;
};
// 查找-多条数据(根据userId找到该用户下的账户数据, 可分页)
const findMultiple = async (ctx) => {
	console.log(`请求->账户->查询用户的账户列表: accounts.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
		pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
	})
	let user = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let { userId } = user;
	let { pageNum, pageSize } = params;
	let where = `userId=${userId}`;
	let selects = [];
	let result = await accountsTable.findMultiple(where, selects, pageNum, pageSize);
	ctx.bodys = result;
};
// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->账户->查询用户全部账户数据: accounts.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let user = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let { userId } = user;
	let result = await accountsTable.findAll(`userId=${userId}`);
	ctx.bodys = result
};

// 更新
// 更新一条账户信息
const updateOne = async (ctx) => {
	console.log(`请求->账户->更新一条数据: accounts.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		site: [{ required: false, message: "" }],
		website: [{ required: true, message: "网址不可为空" }, { pattern: /^[a-zA-z]+:\/\/[^\s]*$/, message: "请输入正确的网址" }],
		introduction: [{ required: false, message: "" }],
		account: [{ required: true, message: "账号不可为空" }],
		password: [{ required: false, message: "" }],
		associates: [{ required: false, message: "" }],
		nickname: [{ required: false, message: "" }],
		status: [{ required: false, message: "" }, { pattern: /[012]/, message: "状态参数错误" }],
		remark: [{ required: false, message: "" }],
		tags: [{ required: false, message: "" }], // 数组字符串
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let values = { ...params, userId };
	let { id } = values;
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
	let params = ctx.verifyParams([{
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		site: [{ required: false, message: "" }],
		website: [{ required: true, message: "网址不可为空" }, { pattern: /^[a-zA-z]+:\/\/[^\s]*$/, message: "请输入正确的网址" }],
		introduction: [{ required: false, message: "" }],
		account: [{ required: true, message: "账号不可为空" }],
		password: [{ required: false, message: "" }],
		associates: [{ required: false, message: "" }],
		nickname: [{ required: false, message: "" }],
		status: [{ required: false, message: "" }, { pattern: /[012]/, message: "状态参数错误" }],
		remark: [{ required: false, message: "" }],
		tags: [{ required: false, message: "" }], // 数组字符串
	}])
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let values = params.map(i => ({ ...i, userId }))
	let where = `userId=${userId} and`; // id校验, 不能让用户乱传id和userId
	let result = await accountsTable.updateMultiple('id', where, values);
	ctx.bodys = result;
}

// 删除
// 删除一条数据
const deleteOne = async (ctx) => {
	console.log(`请求->账户->删除一条数据: accounts.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let values = { ...params, userId };
	let { id } = values;
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
	let params = ctx.verifyParams({
		ids: [{ required: true, message: "参数ids不可为空" }, {
			validator: (value) => {
				if (!value) {
					return { result: false, mesage: '非法参数' };
				}
				let arr = value.split(",");
				let result = arr.every(item => {
					if (/\d+/.test(item)) {
						return true
					}
					return false;
				});
				return { result: result, mesage: result ? '' : 'ids参数错误' };
			}
		}],
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { accountsTable } = await instanceTable();
	let { ids } = params;
	// 开始删除
	// DELETE FROM accounts WHERE id IN (17,18) and userId = 87;
	// let result = await accountsTable.deleteMultiple(`id IN (${ids})`);
	let result = await accountsTable.deleteOne(`userId=${userId} and id IN (${ids})`);
	ctx.bodys = result;
};

// 导入json文件
const importJSONFile = async (ctx) => {
	console.log(`请求->用户->JSON文件上传: accounts.importJSONFile; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	const file = ctx.request.files.file;
	if (!file) {
		return ctx.throw(400, '导入文件不能为空');
	}
	// ---分隔线---
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['application/json']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		return ctx.throw(400, '只支持导入文件为' + allowedType.toString() + '格式');
	}
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
	let { accountsTable } = await instanceTable();
	let { userId } = ctx.session.user || {}; // 获取用户id, 组装数据
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
