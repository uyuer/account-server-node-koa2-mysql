const { instanceTable } = require('../../lib/method');
const config = require("../../config")
const { USERS_TABLE, REGISTEREMAIL_TABLE, AVATARS_TABLE, ACCOUNTS_DETAILS_TABLE, ACCOUNTS_LABELS, LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE, LEDGERS_LABELS_TABLE } = config.database;


const pathName = '账户';
const pathRoute = 'accounts.details';
const rules = {
	id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "数据id格式错误" }],
	label: [{ required: true, message: "标签不可为空" }],
}

// 添加一条数据
const addOne = async (ctx) => {
	console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let params = ctx.verifyParams({
		label: rules.label,
	})
	let { userId } = ctx.session.user || {};
	let { accountsLabelsTable } = await instanceTable(ACCOUNTS_LABELS);
	let { label } = params;
	let labelBeUsed = await accountsLabelsTable.findOne(`label='${label}' and creatorId=${userId}`)
	if (labelBeUsed) {
		return ctx.throw(400, '标签已存在');
	}
	let values = { creatorId: userId, label };
	let keys = Object.keys(values);
	let result = await accountsLabelsTable.addOne(keys, values)
	ctx.bodys = result;
};
// 更新一条数据
const updateOne = async (ctx) => {
	console.log(`请求->${pathName}->更新一条数据: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		label: [{ required: true, message: "标签不可为空" }],
	})
	let { userId } = ctx.session.user || {};
	let { accountsLabelsTable } = await instanceTable(ACCOUNTS_LABELS);
	let { id, label } = params;
	let values = { ...params, creatorId: userId };
	let where = `id=${id} and creatorId=${userId}`;
	console.log(where)
	let info = await accountsLabelsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '标签不存在');
	}
	let result = await accountsLabelsTable.updateOne(where, values);
	ctx.bodys = result;
};

// 查询全部数据
const findAll = async (ctx) => {
	console.log(`请求->${pathName}->查询全部数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let { userId } = ctx.session.user || {};
	let { accountsLabelsTable } = await instanceTable(ACCOUNTS_LABELS);
	let result = await accountsLabelsTable.findAll(`isSystemCreate=1 or creatorId=${userId}`, ['id', 'label', 'isSystemCreate', 'createTime', 'updateTime'])
	ctx.bodys = result;
};

module.exports = {
	addOne,
	updateOne,
	findAll,
}