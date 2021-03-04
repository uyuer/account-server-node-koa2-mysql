const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { session, schema } = require("../../lib/mysqlx");
const {
	accountsRules, // 参数规则
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../../lib/accountsRules");
const ApiError = require("../../lib/apiError");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { filterParams, filterRules, formatFetch, formatFetchAll } = require("../../lib/utils");
const config = require('./../../config/default');
const { baseUploadsPath, avatarPath, avatarFullPath } = require('../../config/uploadsConfig');

// 添加一条数据
const addOne = async (ctx) => {
	console.log(`请求->账户->添加一条数据: accounts.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.body || {};
		// let fields = ['userId', 'website', 'websiteUrl', 'account', 'accountName', 'password', 'status', 'remark'];
		let fields = { userId: '', website: '', websiteUrl: '', account: '', accountName: '', password: '', remark: '' };
		let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
			total[key] = body[key] || fields[key];
			return total;
		}, {})
		let { checkResult, errorMessage, errorType } = verifyParams(validParams); // 校验有效参数是否合法
		if (!checkResult) {
			throw new ApiError(errorType, errorMessage);
		}

		let keys = Object.keys(validParams); // 数组
		let values = keys.map(key => validParams[key]) // 数组

		let ins = await schema;
		let table = ins.getTable('accounts');
		let res = await table.insert(keys).values(values).execute();
		ctx.body = true;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 查找-多条数据
// 根据userId找到该用户下的数据, 可分页
const findMultiple = async (ctx) => {
	console.log(`请求->账户->查询用户的账户列表: accounts.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.query || {};
		let fields = { userId: '', pageNum: 1, pageSize: 10 };
		let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
			total[key] = body[key] || fields[key];
			return total;
		}, {})
		let { checkResult, errorMessage, errorType } = verifyParams(validParams); // 校验有效参数是否合法
		if (!checkResult) {
			throw new ApiError(errorType, errorMessage);
		}

		let { userId, pageNum, pageSize } = validParams;

		let ins = await schema;
		let table = ins.getTable('accounts');
		let userinfo = await table
			.select('id', 'userId', 'website', 'websiteUrl', 'account', 'accountName', 'password', 'status', 'createTime', 'updateTime')
			.where(`userId=:userId`)
			.bind('userId', userId)
			.limit(pageSize)
			.offset((pageNum - 1) * pageSize)
			.execute()
			.then(s => formatFetchAll(s))
		ctx.body = {
			data: userinfo,
			pageNum,
			pageSize
		}
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}

};

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->账户->查询数据详细信息: accounts.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.query || {};
		let fields = { id: '' };
		let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
			total[key] = body[key] || fields[key];
			return total;
		}, {})
		let { checkResult, errorMessage, errorType } = verifyParams(validParams); // 校验有效参数是否合法
		if (!checkResult) {
			throw new ApiError(errorType, errorMessage);
		}

		let { id } = validParams;

		let ins = await schema;
		let table = ins.getTable('accounts');
		let userinfo = await table
			.select('id', 'userId', 'website', 'websiteUrl', 'account', 'accountName', 'password', 'status', 'createTime', 'updateTime')
			.where(`id=:id`)
			.bind('id', id)
			.execute()
			.then(s => formatFetch(s))
		ctx.body = userinfo;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 更新一条用户信息
const updateOne = async (ctx) => {
	console.log(`请求->账户->更新一条数据: accounts.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.body || {};
		let fields = { id: '', userId: '', website: '', websiteUrl: '', account: '', accountName: '', password: '', status: '0', remark: '' };
		let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
			total[key] = body[key] || fields[key];
			return total;
		}, {})
		let { checkResult, errorMessage, errorType } = verifyParams(validParams); // 校验有效参数是否合法
		if (!checkResult) {
			throw new ApiError(errorType, errorMessage);
		}
		// 执行操作---
		// 结构数据
		let { id, userId, ...other } = validParams;
		// 校验是否存在于数据库中
		let ins = await schema;
		let table = ins.getTable('accounts');
		let info = await table.select('id').where(`id=:id`).bind('id', id).execute().then(s => formatFetch(s))
		if (!info) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '数据不存在');
		}

		// 构建插入数据
		let updater = Object.keys(other).reduce((total, currentValue) => {
			total.set(currentValue, other[currentValue])
			return total;
		}, table.update().where('id=:id and userId=:userId').bind('id', id).bind('userId', userId))
		let result = await updater.execute().then(s => {
			let warningsCount = s.getWarningsCount();
			let affectCount = s.getAffectedRowsCount();
			if (warningsCount === 0) {
				return true;
			}
			return false;
		})
		ctx.body = result;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 删除用户
// const deleteOneUser = async (ctx) => {

// };

module.exports = {
	addOne,
	findMultiple,
	findOne,
	updateOne,
}
