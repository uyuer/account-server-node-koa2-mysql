const { instanceTable } = require('./../../lib/method');
const pathName = '账单详情';
const pathRoute = 'ledgers.labels';

module.exports = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			label: [{ required: true, message: "标签不可为空" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersLabelsTable } = await instanceTable();
		let { label } = params;
		// 检查标签是否被使用, 不能和系统标签同名,不能重复创建标签
		let labelBeUsed = await ledgersLabelsTable.findOne(`label='${label}'`)
		if (labelBeUsed) {
			return ctx.throw(400, '标签已存在');
		}
		let labelRepeat = await ledgersLabelsTable.findOne(`label='${label}' and creatorId=${userId}`)
		if (labelRepeat) {
			return ctx.throw(400, '重复创建标签');
		}
		let values = { creatorId: userId, label };
		let keys = Object.keys(values);
		let result = await ledgersLabelsTable.addOne(keys, values)
		ctx.bodys = result;
	},
	// 查找全部数据
	findAll: async (ctx) => {
		console.log(`请求->${pathName}->查询用户全部账本数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let { userId } = ctx.session.user || {};
		let { ledgersLabelsTable } = await instanceTable();
		let result = await ledgersLabelsTable.findAll(`isSystemCreate=1 or creatorId=${userId}`, ['id', 'label', 'isSystemCreate', 'createTime', 'updateTime'])
		ctx.bodys = result;
	},
	// 更新一条数据
	updateOne: async (ctx) => {
		console.log(`请求->${pathName}->更新: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
			label: [{ required: true, message: "标签不可为空" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersLabelsTable } = await instanceTable();
		let { id } = params;
		let values = { ...params, creatorId: userId };
		let where = `id=${id} and creatorId=${userId}`;
		let info = await ledgersLabelsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '标签不存在');
		}
		let result = await ledgersLabelsTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->${pathName}->删除一条数据: ${pathRoute}.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersLabelsTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and creatorId=${userId}`;
		let info = await ledgersLabelsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersLabelsTable.deleteOne(where);
		ctx.bodys = result;
	},
}