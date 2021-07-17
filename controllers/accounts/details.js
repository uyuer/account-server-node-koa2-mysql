const fs = require('fs');
const { isArray } = require('../../lib/utils')
const { instanceTable, formatStatus } = require('../../lib/method');
const config = require("../../config")
const { USERS_TABLE, REGISTEREMAIL_TABLE, AVATARS_TABLE, ACCOUNTS_DETAILS_TABLE, ACCOUNTS_LABELS, LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE, LEDGERS_LABELS_TABLE } = config.database;

const pathName = '账户';
const pathRoute = 'accounts.details';
const rules = {
	id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "数据id格式错误" }],
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
	// 筛选条件
	pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
	pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
}

// 添加一条数据
const addOne = async (ctx) => {
	console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		site: rules.site,
		website: rules.website,
		introduction: rules.introduction,
		account: rules.account,
		password: rules.password,
		associates: rules.associates,
		nickname: rules.nickname,
		status: rules.status,
		remark: rules.remark,
		tags: rules.tags,
	})
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let values = { ...params, userId };
	let keys = Object.keys(values);
	let result = await accountsDetailsTable.addOne(keys, values);
	ctx.bodys = result;
};

// 添加多条数据
const addMultiple = async (ctx) => {
	console.log(`请求->${pathName}->添加多条数据: ${pathRoute}.addMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams([{
		site: rules.site,
		website: rules.website,
		introduction: rules.introduction,
		account: rules.account,
		password: rules.password,
		associates: rules.associates,
		nickname: rules.nickname,
		status: rules.status,
		remark: rules.remark,
		tags: rules.tags,
	}])
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let values = params.map(i => ({ ...i, userId }))
	let keys = Object.keys(values[0]);
	let result = await accountsDetailsTable.addMultiple(keys, values);
	ctx.bodys = result;
}

// 查询一条数据
const findOne = async (ctx) => {
	console.log(`请求->${pathName}->查询一条数据: ${pathRoute}.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: rules.id,
	})
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let { id } = params;
	let where = `id=${id} and userId=${userId}`;
	let selects = []; // 查询全部
	let result = await accountsDetailsTable.findOne(where, selects);
	let statusText = formatStatus(result.status);
	ctx.bodys = { ...result, statusText };
};
// 查询多条数据-可分页
const findMultiple = async (ctx) => {
	console.log(`请求->${pathName}->查询多条数据-可分页: ${pathRoute}.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		pageNum: rules.pageNum,
		pageSize: rules.pageSize,
	})
	let user = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let { userId } = user;
	let { pageNum, pageSize } = params;
	let where = `userId=${userId}`;
	let selects = [];
	let result = await accountsDetailsTable.findMultiple(where, selects, pageNum, pageSize);
	let fromatResult = (result.data || []).map(item => {
		return { ...item, statusText: formatStatus(item.status) }
	})
	ctx.bodys = { ...result, data: fromatResult };
};
// 查询全部数据
const findAll = async (ctx) => {
	console.log(`请求->${pathName}->查询全部数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let user = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let { userId } = user;
	let result = await accountsDetailsTable.findAll(`userId=${userId}`);
	let fromatResult = result.map(item => {
		return { ...item, statusText: formatStatus(item.status) }
	})
	ctx.bodys = fromatResult;
};

// 更新一条数据
const updateOne = async (ctx) => {
	console.log(`请求->${pathName}->更新一条数据: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: rules.id,
		site: rules.site,
		website: rules.website,
		introduction: rules.introduction,
		account: rules.account,
		password: rules.password,
		associates: rules.associates,
		nickname: rules.nickname,
		status: rules.status,
		remark: rules.remark,
		tags: rules.tags,
	})
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let values = { ...params, userId };
	let { id } = values;
	let where = `id=${id} and userId=${userId}`;
	let info = await accountsDetailsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	let result = await accountsDetailsTable.updateOne(where, values);
	ctx.bodys = result;
};
// 更新多条数据
const updateMultiple = async (ctx) => {
	console.log(`请求->${pathName}->更新多条数据: ${pathRoute}.updateMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams([{
		id: rules.id,
		site: rules.site,
		website: rules.website,
		introduction: rules.introduction,
		account: rules.account,
		password: rules.password,
		associates: rules.associates,
		nickname: rules.nickname,
		status: rules.status,
		remark: rules.remark,
		tags: rules.tags,
	}])
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let values = params.map(i => ({ ...i, userId }))
	let where = `userId=${userId} and`;
	let result = await accountsDetailsTable.updateMultiple('id', where, values);
	ctx.bodys = result;
}

// 删除一条数据
const deleteOne = async (ctx) => {
	console.log(`请求->${pathName}->删除一条数据: ${pathRoute}.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: rules.id,
	})
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let values = { ...params, userId };
	let { id } = values;
	let where = `id=${id} and userId=${userId}`;
	let info = await accountsDetailsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '数据不存在');
	}
	let result = await accountsDetailsTable.deleteOne(where);
	ctx.bodys = result;
};
// 删除多条数据
const deleteMultiple = async (ctx) => {
	console.log(`请求->${pathName}->删除一条数据: ${pathRoute}.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		ids: rules.ids,
	})
	let { userId } = ctx.session.user || {};
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let { ids } = params;
	// DELETE FROM accounts WHERE id IN (17,18) and userId = 87;
	// let result = await accountsDetailsTable.deleteMultiple(`id IN (${ids})`);
	let result = await accountsDetailsTable.deleteOne(`userId=${userId} and id IN (${ids})`);
	ctx.bodys = result;
};

// 导入json文件
const importJSONFile = async (ctx) => {
	console.log(`请求->用户->JSON文件上传: ${pathRoute}.importJSONFile; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	const maxSize = 0.5 * 1024 * 1024;
	const file = ctx.request.files.file;
	if (!file) {
		return ctx.throw(400, '导入文件不能为空');
	}
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['application/json']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		return ctx.throw(400, '只支持导入文件为' + allowedType.toString() + '格式');
	}
	if (file.size > maxSize) {
		return ctx.throw(400, '上传文件过大,仅支持' + (maxSize / 1024 / 1024) + 'M以内的文件');
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
	let { accountsDetailsTable } = await instanceTable(ACCOUNTS_DETAILS_TABLE);
	let { userId } = ctx.session.user || {};
	let values = fileData.map(item => {
		return { ...item, userId }
	})
	let keys = Object.keys(values[0]);
	let result = await accountsDetailsTable.addMultiple(keys, values);
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
