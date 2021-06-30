const { formatFetchAll } = require('./../../lib/utils')
const { instanceTable } = require('./../../lib/method');
const pathName = '账单详情';
const pathRoute = 'ledgers.details';
const rules = {
	id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "数据id格式错误" }],
	bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
	type: [{ required: true, message: "类型不可为空" }, { pattern: /[01]/, message: "类型格式错误" }],
	date: [{ required: true, message: "日期不可为空" }, { pattern: /^[1-9]\d{3}-[01]\d-(([0-2]\d)|(3[01]))$/, message: "日期格式错误" }],
	amount: [{ required: true, message: "金额不可为空" }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "金额格式错误" }],
	labelId: [{ required: true, message: "标签id不可为空" }, { pattern: /^[1-9]\d*$/, message: "标签id格式错误" }],
	remark: [{ required: false, message: "" }],
	// 筛选条件
	start: [{ required: false, message: "" }],
	end: [{ required: false, message: "" }],
}

module.exports = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			bookId: rules.bookId,
			type: rules.type,
			date: rules.date,
			amount: rules.amount,
			labelId: rules.labelId,
			remark: rules.remark,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersDetailsTable } = await instanceTable();
		let values = { ...params, userId };
		let keys = Object.keys(values);
		let result = await ledgersDetailsTable.addOne(keys, values);
		ctx.bodys = result;
	},
	// 添加多条数据
	addMultiple: async (ctx) => {
		console.log(`请求->${pathName}->添加多条数据: ${pathRoute}.addMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams([{
			bookId: rules.bookId,
			type: rules.type,
			date: rules.date,
			amount: rules.amount,
			labelId: rules.labelId,
			remark: rules.remark,
		}])
		let { userId } = ctx.session.user || {};
		let { ledgersDetailsTable } = await instanceTable();
		let values = params.map(i => ({ ...i, userId }))
		let keys = Object.keys(values[0]);
		let result = await ledgersDetailsTable.addMultiple(keys, values);
		ctx.bodys = result;
	},
	// 查询全部数据
	// findAll: async (ctx) => {
	// 	console.log(`请求->${pathName}->查询用户全部账本数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
	// 	let params = ctx.verifyParams({
	// 		bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
	// 		start: [{ required: false, message: "" }],
	// 		end: [{ required: false, message: "" }],
	// 	})
	// 	let { userId } = ctx.session.user || {};
	// 	let { ledgersDetailsTable } = await instanceTable();
	// 	let { bookId, start, end } = params;
	// 	let result = await ledgersDetailsTable.findAll(`bookId=${bookId} and userId=${userId} and date>='${start}' and date<='${end}'`);
	// 	let formatResult = result.map(item => {
	// 		return { ...item, date: dayjs(item.date).format('YYYY-DD-MM') }
	// 	})
	// 	ctx.bodys = formatResult;
	// },
	// 查询全部数据-使用视图方式查询
	findAll: async (ctx) => {
		console.log(`请求->${pathName}->查询用户全部账本数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			bookId: rules.bookId,
			start: rules.start,
			end: rules.end,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersDetailsTable } = await instanceTable();
		let { tableIns, dbName } = ledgersDetailsTable;
		let { bookId, start, end } = params;
		let result = await tableIns
			.getSession()
			.sql(`select * from ${dbName}.ledgers_view where bookId=${bookId} and userId=${userId} and date>='${start}' and date<='${end}'`)
			.execute()
			.then(s => formatFetchAll(s))
		ctx.bodys = result;
	},
	// 更新一条数据
	updateOne: async (ctx) => {
		console.log(`请求->${pathName}->更新一条数据: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: rules.id,
			bookId: rules.bookId,
			type: rules.type,
			date: rules.date,
			amount: rules.amount,
			labelId: rules.labelId,
			remark: rules.remark,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersDetailsTable } = await instanceTable();
		let { id, ...values } = params;
		let where = `id=${id} and userId=${userId}`;
		let info = await ledgersDetailsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersDetailsTable.updateOne(where, values);
		ctx.bodys = result;
	},
	// 更新多条数据
	updateMultiple: async (ctx) => {
		console.log(`请求->${pathName}->更新多条数据: ${pathRoute}.updateMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams([{
			id: rules.id,
			bookId: rules.bookId,
			type: rules.type,
			date: rules.date,
			amount: rules.amount,
			labelId: rules.labelId,
			remark: rules.remark,
		}])
		let { userId } = ctx.session.user || {};
		// ---分隔线---
		let { ledgersDetailsTable } = await instanceTable();
		let values = params.map(i => ({ ...i, userId }))
		let where = `userId=${userId} and`; // id校验, 不能让用户乱传id和userId
		let result = await ledgersDetailsTable.updateMultiple('id', where, values);
		ctx.bodys = result;
	},
	// 删除一条数据
	deleteOne: async (ctx) => {
		console.log(`请求->${pathName}->删除一条数据: ${pathRoute}.deleteOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: rules.id,
			bookId: rules.bookId,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersDetailsTable } = await instanceTable();
		let { id, bookId } = params;
		let where = `id=${id} and bookId=${bookId} and userId=${userId}`;
		let info = await ledgersDetailsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersDetailsTable.deleteOne(where);
		ctx.bodys = result;
	},
}
