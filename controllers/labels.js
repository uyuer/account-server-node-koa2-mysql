const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { session, schema } = require("../lib/mysqlx");
const {
	screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../lib/verify");
const { formatFetch, formatFetchAll, isArray } = require("../lib/utils");

const labelsRules = require("../rules/labels");

let tableFields = {
	label: '', // 标签名
	creatorId: '', // 创建者用户id
};
// 新增标签
const addOne = async (ctx) => {
	console.log(`请求->标签->新增: label.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	let body = ctx.request.body || {};
	let fields = tableFields;
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, labelsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 执行操作---
	let ins = await schema;
	let labelsTable = ins.getTable('labels');

	let { creatorId, label } = validParams;
	// 检查标签是否被使用
	let labelBeUsed = await labelsTable
		.select('id')
		.where(`label=:label`)
		.bind('label', label)
		.execute()
		.then((s) => formatFetch(s));
	if (labelBeUsed) {
		return ctx.throw(400, '标签重复');
	}
	// 构建数据
	let keys = ['creatorId', 'label'];
	let values = [creatorId, label];
	// 插入数据库
	let result = await labelsTable.insert(keys).values(values).execute().then(async s => {
		let affectCount = s.getAffectedItemsCount();
		if (affectCount === 1) {
			return true;
		}
		return false;
	});
	ctx.body = result;
};
// 编辑标签
const updateOne = async (ctx) => {
	console.log(`请求->标签->更新: labels.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	// TODO:这里的用户id字段creatorId, 应该由后端来取
	let fields = { id: '', ...tableFields }; // 校验字段
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, labelsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 执行操作---
	let { id, creatorId, ...other } = validParams;
	let ins = await schema;
	let labelsTable = ins.getTable('labels');
	let info = await labelsTable.select('id').where(`id=${id} and creatorId=${creatorId}`).execute().then(s => formatFetch(s))
	if (!info) {
		return ctx.throw(400, '标签不存在');
	}
	let updater = Object.keys(other).reduce((total, currentValue) => {
		total.set(currentValue, other[currentValue])
		return total;
	}, labelsTable.update().where(`id=${id} and creatorId=${creatorId}`))
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

// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->标签->查询用户全部标签: labels.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = { creatorId: '' };
	// 校验参数并返回有效参数
	let { errors, validParams } = verifyParams(fields, body, labelsRules);
	if (errors.length > 0) {
		return ctx.throw(400, errors[0]);
	}
	// 执行操作---
	let ins = await schema;
	let labelsTable = ins.getTable('labels');
	let usersTable = ins.getTable('users');

	let { creatorId } = validParams;
	// 查询系统管理账户
	let sysUser = await usersTable
		.select('id')
		.where(`username=:u`)
		.bind('u', 'admin')
		.execute()
		.then((s) => formatFetch(s));
	let labelsList = await labelsTable
		.select()
		.where(`creatorId=${sysUser.id} or creatorId=${creatorId}`)
		.execute()
		.then(s => formatFetchAll(s))
	ctx.body = labelsList;
};

module.exports = {
	addOne,
	updateOne,
	findAll,
}