const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { session, schema } = require("../../lib/mysqlx");
const {
	rules, // 参数规则
	screeningRules, // 筛选参数对应规则
	verifyRules, // 校验是否符合规则
	verifyParams, // 验证参数是否合法
} = require("../../lib/accountsRules");
const ApiError = require("../../lib/apiError");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { formatFetch, formatFetchAll } = require("../../lib/utils");
const config = require('./../../config/default');
const { baseUploadsPath, avatarPath, avatarFullPath } = require('../../config/uploadsConfig');

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->用户->查询一条数据: users.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.query || {};
		let fields = { id: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body)
		// 执行操作---
		let { id } = validParams;
		let ins = await schema;
		let table = ins.getTable('users');
		let userinfo = await table
			.select('id', 'username', 'male', 'avatarId', 'email', 'emailActive', 'status', 'createTime', 'updateTime')
			.where(`id=:id`)
			.bind('id', id)
			.select()
			.execute()
			.then(s => formatFetch(s))
		if (!userinfo) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户不存在');
		}
		ctx.body = userinfo;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 更新一条用户信息
const updateOne = async (ctx) => {
	console.log(`请求->用户->更新一条数据: users.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.body || {};
		let fields = { id: '', male: '', avatarId: '' }; // 校验字段
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body)
		// 执行操作---
		let { id, ...other } = validParams;
		let ins = await schema;
		let table = ins.getTable('users');
		let info = await table.select('id', 'status').where(`id=:u`).bind('u', id).execute().then(s => formatFetch(s))
		if (!info) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户不存在');
		} else {
			let { status } = info;
			if (status === '0') {
				throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户被冻结');
			}
		}
		let updater = Object.keys(other).reduce((total, currentValue) => {
			total.set(currentValue, other[currentValue])
			return total;
		}, table.update().where('id=:id').bind('id', id))
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

// 删除用户
// const deleteOneUser = async (ctx) => {

// };

// 用户头像上传
const uploadProfilePicture = async (ctx) => {
	console.log(`请求->用户->用户头像上传: uploadProfilePicture.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	try {
		let body = ctx.request.body || {}; // 为空
		let fields = { id: '' };
		// 校验参数并返回有效参数
		let validParams = verifyParams(fields, body)
		const file = ctx.request.files.file;
		if (!file) {
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户头像不能为空');
		}
		// 执行操作---
		const { path: filePath, name, type, lastModifiedDate } = file;
		// 检查上传文件是否合法, 如果非法则删除文件
		let allowedType = ['image/png', 'image/jpeg', 'image/gif']
		if (!allowedType.find(t => t === type)) {
			fs.unlinkSync(filePath)
			throw new ApiError(ApiErrorNames.ERROR_PARAMS, '头像只支持' + allowedType.toString() + '格式');
		}
		// 获取到上传文件名
		let fileName = path.basename(filePath);

		// 将用户id,文件名,文件路径存入数据库
		let { id: userId } = validParams;
		let keys = ['userId', 'fileName'];
		let values = [userId, fileName];
		let ins = await schema;
		let table = ins.getTable('avatars');
		let res = await table.insert(keys).values(values).execute();
		ctx.body = true;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
}
module.exports = {
	updateOne,
	findOne,
	uploadProfilePicture
}
// console.log()
// 读取文件
// let res = fs.readFileSync(filePath);
// console.log(Buffer.isBuffer(res))
// console.log(res.toJSON())
// ctx.body = {
// 	name: '头像上传',
// 	res: res.toJSON(),
// }
// fs.renameSync(path, avatarFullPath + '/' + 'a.png') // 重命名弃用

// // 新增用户
// // 插入用户只需要几个必选参数, 其他为可选
// const insertUser = async (ctx) => {

// };

// // 查找-多条件查找用户(暂时不多条件)
// const findMultipleUser = async (ctx) => {

// };
