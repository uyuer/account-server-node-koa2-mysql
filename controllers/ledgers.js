const fs = require('fs');
const dayjs = require('dayjs');
const { isArray, formatFetch, formatFetchAll } = require('../lib/utils')
const { instanceTable, formatStatus } = require('../lib/method');

const books = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->账本->添加一条数据: ledgers.books.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let keys = Object.keys(values); // 数组
		let result = await ledgersBooksTable.addOne(keys, values);
		ctx.bodys = result;
	},
	// 查找-指定ID查找账本信息
	findOne: async (ctx) => {
		console.log(`请求->账本->查询数据详细信息: ledgers.books.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		// 这里使用了userId辅助精确删除, 但是当admin等管理员删除时会存在问题, 可能需要做一个权限的判断之类的
		let { id } = params;
		let where = `id=${id} and userId=${userId}`;
		let selects = ['id', 'name', 'remark', 'createTime', 'updateTime']; // 查询全部
		let result = await ledgersBooksTable.findOne(where, selects);
		let statusText = formatStatus(result.status);
		ctx.bodys = { ...result, statusText };
	},
	// 查找-多条数据(根据userId找到该用户下的账本数据, 可分页)
	findMultiple: async (ctx) => {
		console.log(`请求->账本->查询用户的账本列表: ledgers.books.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
			pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		let { pageNum, pageSize } = params;
		let where = `userId=${userId}`;
		let selects = [];
		let result = await ledgersBooksTable.findMultiple(where, selects, pageNum, pageSize);
		ctx.bodys = result;
	},
	// 查找-全部数据(根据userId找到该用户下的全部账本数据)
	findAll: async (ctx) => {
		console.log(`请求->账本->查询用户全部账本数据: ledgers.books.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		let result = await ledgersBooksTable.findAll(`userId=${userId}`);
		ctx.bodys = result;
	},
	// 更新一条账本信息
	updateOne: async (ctx) => {
		console.log(`请求->账本->更新一条数据: ledgers.books.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and userId=${userId}`;
		// 校验是否存在于数据库中
		let info = await ledgersBooksTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		// 插入
		let result = await ledgersBooksTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->账本->删除一条数据: ledgers.books.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersBooksTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and userId=${userId}`;
		// 检查数据是否存在
		let info = await ledgersBooksTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		// 如果存在, 则删除
		let result = await ledgersBooksTable.deleteOne(where);
		ctx.bodys = result;
	},
}


const labels = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->账本标签->添加一条数据: ledgers.labels.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			label: [{ required: true, message: "标签不可为空" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersLabelsTable } = await instanceTable();
		let { label } = params;
		// 检查标签是否被使用
		let labelBeUsed = await ledgersLabelsTable.findOne(`label='${label}' and creatorId=${userId}`)
		if (labelBeUsed) {
			return ctx.throw(400, '标签已存在');
		}
		// 构建数据
		let values = { creatorId: userId, label };
		let keys = Object.keys(values);
		// 插入数据库
		let result = await ledgersLabelsTable.addOne(keys, values)
		ctx.bodys = result;
	},
	// 查找-全部数据(根据userId找到该用户下的全部账本数据)
	findAll: async (ctx) => {
		console.log(`请求->账本标签->查询用户全部账本数据: ledgers.labels.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersLabelsTable } = await instanceTable();
		let result = await ledgersLabelsTable.findAll(`isSystemCreate=1 or creatorId=${userId}`, ['id', 'label', 'isSystemCreate', 'createTime', 'updateTime'])
		ctx.bodys = result;
	},
	// 更新一条账本信息
	updateOne: async (ctx) => {
		console.log(`请求->账本标签->更新一条数据: ledgers.labels.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
			label: [{ required: true, message: "标签不可为空" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersLabelsTable } = await instanceTable();
		let { id, label } = params;
		let values = { ...params, creatorId: userId };
		let where = `id=${id} and creatorId=${userId}`;
		console.log(where)
		// 校验是否存在于数据库中
		let info = await ledgersLabelsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '标签不存在');
		}
		let result = await ledgersLabelsTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->账本标签->删除一条数据: ledgers.labels.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersLabelsTable } = await instanceTable();
		let values = { ...params, userId };
		let { id } = values;
		let where = `id=${id} and creatorId=${userId}`;
		// 检查数据是否存在
		let info = await ledgersLabelsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		// 如果存在, 则删除
		let result = await ledgersLabelsTable.deleteOne(where);
		ctx.bodys = result;
	},
}


const details = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->账单详情->添加一条数据: ledgers.details.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			type: [{ required: true, message: "类型不可为空" }, { pattern: /[01]/, message: "类型格式错误" }],
			date: [{ required: true, message: "日期不可为空" }, { pattern: /^[1-9]\d{3}-[01]\d-(([0-2]\d)|(3[01]))$/, message: "日期格式错误" }],
			amount: [{ required: true, message: "金额不可为空" }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "金额格式错误" }],
			labelId: [{ required: true, message: "标签id不可为空" }, { pattern: /^[1-9]\d*$/, message: "标签id格式错误" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersDetailsTable } = await instanceTable();
		let values = { ...params, userId };
		let keys = Object.keys(values); // 数组
		let result = await ledgersDetailsTable.addOne(keys, values);
		ctx.bodys = result;
	},
	// 查找-全部数据(根据userId找到该用户下的全部账本数据)
	// findAll: async (ctx) => {
	// 	console.log(`请求->账单详情->查询用户全部账本数据: ledgers.details.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	// 	let params = ctx.verifyParams({
	// 		bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
	// 		start: [{ required: false, message: "" }],
	// 		end: [{ required: false, message: "" }],
	// 	})
	// 	let { userId } = ctx.session.user || {};
	// 	// ---分隔线---
	// 	let { ledgersDetailsTable } = await instanceTable();
	// 	let { bookId, start, end } = params;
	// 	let result = await ledgersDetailsTable.findAll(`bookId=${bookId} and userId=${userId} and date>='${start}' and date<='${end}'`);
	// 	let formatResult = result.map(item => {
	// 		return { ...item, date: dayjs(item.date).format('YYYY-DD-MM') }
	// 	})
	// 	ctx.bodys = formatResult;
	// },
	// 使用视图方式查询
	findAll: async (ctx) => {
		console.log(`请求->账单详情->查询用户全部账本数据: ledgers.details.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			start: [{ required: false, message: "" }],
			end: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersDetailsTable } = await instanceTable();
		let { tableIns, dbName, tableName } = ledgersDetailsTable;
		console.log(await tableIns.isView())
		let { bookId, start, end } = params;
		let result = await tableIns
			.getSession()
			.sql(`select * from ${dbName}.ledgers_view where bookId=${bookId} and userId=${userId} and date>='${start}' and date<='${end}'`)
			.execute()
			.then(s => formatFetchAll(s))
		ctx.bodys = result;
	},
	// 更新一条账本信息
	updateOne: async (ctx) => {
		console.log(`请求->账单详情->更新一条数据: ledgers.details.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
			type: [{ required: true, message: "类型不可为空" }, { pattern: /[01]/, message: "类型格式错误" }],
			date: [{ required: true, message: "日期不可为空" }, { pattern: /^[1-9]\d{3}-[01]\d-(([0-2]\d)|(3[01]))$/, message: "日期格式错误" }],
			amount: [{ required: true, message: "金额不可为空" }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "金额格式错误" }],
			labelId: [{ required: true, message: "标签id不可为空" }, { pattern: /^[1-9]\d*$/, message: "标签id格式错误" }],
			remark: [{ required: false, message: "" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersDetailsTable } = await instanceTable();
		let { id, ...values } = params;
		let where = `id=${id} and userId=${userId}`;
		// 校验是否存在于数据库中
		let info = await ledgersDetailsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		// 插入
		let result = await ledgersDetailsTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->账单详情->删除一条数据: ledgers.details.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
			bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
		})
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersDetailsTable } = await instanceTable();
		let { id, bookId } = params;
		let where = `id=${id} and bookId=${bookId} and userId=${userId}`;
		// 检查数据是否存在
		let info = await ledgersDetailsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		// 如果存在, 则删除
		let result = await ledgersDetailsTable.deleteOne(where);
		ctx.bodys = result;
	},
}

module.exports = {
	books,
	details,
	labels,
}
