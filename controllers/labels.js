const { instanceTable } = require('../lib/method');

let tableFields = {
	label: '', // 标签名
	creatorId: '', // 创建者用户id
};
// 新增标签
const addOne = async (ctx) => {
	console.log(`请求->标签->新增: label.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let params = ctx.verifyParams({
		label: [{ required: true, message: "标签不可为空" }],
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { labelsTable } = await instanceTable();
	let { label } = params;
	// 检查标签是否被使用
	let labelBeUsed = await labelsTable.findOne(`label='${label}' and creatorId=${userId}`)
	if (labelBeUsed) {
		return ctx.throw(400, '标签已存在');
	}
	// 构建数据
	let values = { creatorId: userId, label };
	let keys = Object.keys(values);
	// 插入数据库
	let result = await labelsTable.addOne(keys, values)
	ctx.bodys = result;
};
// 编辑标签
const updateOne = async (ctx) => {
	console.log(`请求->标签->更新: labels.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let params = ctx.verifyParams({
		id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		label: [{ required: true, message: "标签不可为空" }],
	})
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { labelsTable } = await instanceTable();
	let { id, label } = params;
	let values = { ...params, creatorId: userId };
	let where = `id=${id} and creatorId=${userId}`;
	console.log(where)
	// 校验是否存在于数据库中
	let info = await labelsTable.findOne(where);
	if (!info) {
		return ctx.throw(400, '标签不存在');
	}
	let result = await labelsTable.updateOne(where, values);
	ctx.bodys = result;
};

// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->标签->查询用户全部标签: labels.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let { userId } = ctx.session.user || {};
	// ---分隔线---
	let { labelsTable } = await instanceTable();
	let result = await labelsTable.findAll(`isSystemCreate=1 or creatorId=${userId}`, ['id', 'label', 'isSystemCreate', 'createTime', 'updateTime'])
	ctx.bodys = result;
};

module.exports = {
	addOne,
	updateOne,
	findAll,
}