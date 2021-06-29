const { instanceTable, formatStatus } = require('./../../lib/method');
const pathName = '账单详情';
const pathRoute = 'ledgers.books';

module.exports = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let keys = Object.keys(values);
		let result = await ledgersBooksTable.addOne(keys, values);
		ctx.bodys = result;
	},
	// 查询一条数据
	findOne: async (ctx) => {
		console.log(`请求->${pathName}->查询数据详细信息: ${pathRoute}.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let { id } = params;
		let where = `id=${id} and userId=${userId}`;
		let selects = ['id', 'name', 'remark', 'createTime', 'updateTime'];
		let result = await ledgersBooksTable.findOne(where, selects);
		let statusText = formatStatus(result.status);
		ctx.bodys = { ...result, statusText };
	},
	// 查询多条数据-可分页
	findMultiple: async (ctx) => {
		console.log(`请求->${pathName}->查询用户的账本列表: ${pathRoute}.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
			pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let { pageNum, pageSize } = params;
		let where = `userId=${userId}`;
		let selects = [];
		let result = await ledgersBooksTable.findMultiple(where, selects, pageNum, pageSize);
		ctx.bodys = result;
	},
	// 查询全部数据
	findAll: async (ctx) => {
		console.log(`请求->${pathName}->查询用户全部账本数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let result = await ledgersBooksTable.findAll(`userId=${userId}`);
		ctx.bodys = result;
	},
	// 更新一条数据
	updateOne: async (ctx) => {
		console.log(`请求->${pathName}->更新一条数据: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and userId=${userId}`;
		let info = await ledgersBooksTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersBooksTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->${pathName}->删除一条数据: ${pathRoute}.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and userId=${userId}`;
		let info = await ledgersBooksTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersBooksTable.deleteOne(where);
		ctx.bodys = result;
	},
}