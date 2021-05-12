const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { session, schema } = require("../../lib/mysqlx.lib");
const {
	rules, // 参数规则
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../../rules/accountsRules");
const ApiError = require("../../lib/apiError.lib");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { formatFetch, formatFetchAll, isArray } = require("../../lib/utils");

let tableFields = {
	label: '', // 标签名
	creatorId: '', // 创建者用户id
};
// 新增标签
const addOne = async (ctx) => {
	console.log(`请求->标签->新增: label.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `);
	try {
		let body = ctx.request.body || {};
		let fields = { creatorId: '', label: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body);
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
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '标签重复'); // 邮箱已被使用
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
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};
// 编辑标签
const updateOne = async (ctx) => {
	console.log(`请求->标签->更新: labels.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.body || {};
		// TODO:这里的用户id字段creatorId, 应该由后端来取
		let fields = { id: '', label: '', creatorId: '' }; // 校验字段
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body)
		// 执行操作---
		let { id, creatorId, ...other } = validParams;
		let ins = await schema;
		let labelsTable = ins.getTable('labels');
		let info = await labelsTable.select('id').where(`id=${id} and creatorId=${creatorId}`).execute().then(s => formatFetch(s))
		if (!info) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '标签不存在');
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
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 查找-全部数据(根据userId找到该用户下的全部账户数据)
const findAll = async (ctx) => {
	console.log(`请求->标签->查询用户全部标签: labels.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.query || {};
		let fields = { creatorId: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body)
		// 执行操作---
		let ins = await schema;
		let labelsTable = ins.getTable('labels');

		let { creatorId } = validParams;

		let labelsList = await labelsTable
			.select()
			.where(`creatorId=${creatorId}`)
			.execute()
			.then(s => formatFetchAll(s))
		ctx.body = labelsList;
	} catch (error) {
		throw new ApiError(ApiErrorNames.UNKNOW_ERROR, error.message);
	}
};

module.exports = {
	addOne,
	updateOne,
	findAll,
}