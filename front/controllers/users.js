const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { session, schema } = require("../../lib/mysqlx");
const { usersRules, checkRules, checkField } = require("../../lib/usersRules");
const ApiError = require("../../lib/apiError");
const ApiErrorNames = require("../../lib/apiErrorNames");
const { filterParams, filterRules, formatFetch } = require("../../lib/utils");
const config = require('./../../config/default');
const { baseUploadsPath, avatarPath, avatarFullPath } = require('../../config/uploadsConfig');

// 查找-指定ID查找用户信息
const findOne = async (ctx) => {
	console.log(`请求->用户->更新一条数据: updateOne.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.query || {};
	let fields = ['id'];
	let { checkResult, errorMessage, errorType } = checkField(fields, body); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	let { id } = body;
	try {
		let ins = await schema;
		let table = ins.getTable('users');
		let userinfo = await table
			.select('id', 'username', 'male', 'avatar', 'email', 'emailActive', 'status', 'createTime', 'updateTime')
			.where(`id=:id`)
			.bind('id', id)
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
	console.log(`请求->用户->更新一条数据: updateOne.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {};
	let fields = ['id', 'male', 'avatar']; // 校验字段
	// body(用户上传参数) fields(插入表中的字段,也叫合法字段)
	// 取出body和fields中共同的字段, 此处字段有可能有也有可能没有,只取出共同包含的
	let params = Object.keys(body).reduce((total, key) => {
		let res = fields.find(item => key === item);
		if (res) {
			total[key] = body[key];
		}
		return total;
	}, {});
	if (Object.keys(params).length <= 0) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, '参数缺失');
	}
	let { checkResult, errorMessage, errorType } = checkField(Object.keys(params), params); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	let { id, ...other } = params;
	try {
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
		// table.update().where('id=:id').bind('id', id).set('male', '1').set('avatar', '1').execute().then(res => {
		// 	console.log(res)
		// })
		let updater = Object.keys(other).reduce((total, currentValue) => {
			total.set(currentValue, other[currentValue])
			return total;
		}, table.update().where('id=:id').bind('id', id))
		let result = await updater.execute().then(s => {
			let warningsCount = s.getWarningsCount();
			let affectCount = s.getAffectedRowsCount();
			if (warningsCount === 0) {
				return true;
			}
			return false;
			// console.log(s)
			// console.log(s.getWarnings())
			// console.log(s.getWarningsCount())
			// console.log(s.getAffectedItemsCount())
			// console.log(s.getAffectedRowsCount())
			// console.log(s.getAutoIncrementValue())
			// console.log(s.getGeneratedIds())
		})
		console.log(result)
		ctx.body = result;
	} catch (error) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, error.message);
	}
};

// 删除用户
// const deleteOneUser = async (ctx) => {

// };

// 用户头像上传
// 参数 id: 用户id
// 参数 file: 用户头像文件
const uploadProfilePicture = async (ctx) => {
	console.log(`请求->用户->用户头像上传: uploadProfilePicture.connect; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	let body = ctx.request.body || {}; // 为空
	let fields = ['id'];
	let { checkResult, errorMessage, errorType } = checkField(fields, body); // 校验参数是否合法
	if (!checkResult) {
		throw new ApiError(errorType, errorMessage);
	}
	const file = ctx.request.files.file;
	if (!file) {
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, '用户头像不能为空');
	}
	const { path: filePath, name, type, lastModifiedDate } = file;
	// 检查上传文件是否合法, 如果非法则删除文件
	let allowedType = ['image/png', 'image/jpeg', 'image/gif']
	if (!allowedType.find(t => t === type)) {
		fs.unlinkSync(filePath)
		throw new ApiError(ApiErrorNames.ERROR_PARAMS, '头像只支持' + allowedType.toString() + '格式');
	}
	// 获取到上传文件名
	let fileName = path.basename(filePath);
	try {
		// 将用户id,文件名,文件路径存入数据库
		let { id: userId } = body;
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
