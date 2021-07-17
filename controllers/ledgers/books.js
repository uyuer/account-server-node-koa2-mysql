const { instanceTable, formatStatus } = require('./../../lib/method');
const config = require("../../config")
const { USERS_TABLE, REGISTEREMAIL_TABLE, AVATARS_TABLE, ACCOUNTS_DETAILS_TABLE, ACCOUNTS_LABELS, LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE, LEDGERS_LABELS_TABLE } = config.database;

const pathName = '账本';
const pathRoute = 'ledgers.books';
const rules = {
	id: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
	name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
	remark: [{ required: false, message: "" }],
	// 筛选条件
	pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
	pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
}

module.exports = {
	// 添加一条数据
	addOne: async (ctx) => {
		console.log(`请求->${pathName}->添加一条数据: ${pathRoute}.addOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			name: rules.name,
			remark: rules.remark,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable(LEDGERS_BOOKS_TABLE);
		let values = { ...params, userId };
		let keys = Object.keys(values);
		let result = await ledgersBooksTable.addOne(keys, values);
		ctx.bodys = result;
	},
	// 查询一条数据
	findOne: async (ctx) => {
		console.log(`请求->${pathName}->查询一条数据: ${pathRoute}.findOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: rules.id,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable, ledgersDetailsTable } = await instanceTable(LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE);
		let { id } = params;
		// 未来待办: 这里本该使用sql语句一次性查询完成账本的收入支出统计功能(同一个账本下type有'收入','支出'两种类型),因为我还不会编写复杂的SQL语句而暂时这样处理
		let where = `id=${id} and userId=${userId}`;
		let selects = ['id', 'name', 'remark', 'createTime', 'updateTime'];
		let result = await ledgersBooksTable.findOne(where, selects);
		let details = await ledgersDetailsTable.findAll(`bookId=${id}`, ['id', 'amount', 'type']);
		let statistics = (details || []).reduce((total, currentValue) => {
			switch (currentValue.type) {
				case '0': total.expend += currentValue.amount; break;
				case '1': total.income += currentValue.amount; break;
			}
			return total;
		}, { expend: 0, income: 0 })
		ctx.bodys = { ...result, ...statistics };
	},
	// 查询多条数据-可分页
	findMultiple: async (ctx) => {
		console.log(`请求->${pathName}->查询多条数据-可分页: ${pathRoute}.findMultiple; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			pageNum: rules.pageNum,
			pageSize: rules.pageSize,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable, ledgersDetailsTable } = await instanceTable(LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE);
		// 未来待办: 这里本该使用sql语句一次性查询完成账本的收入支出统计功能(同一个账本下type有'收入','支出'两种类型),因为我还不会编写复杂的SQL语句而暂时这样处理
		let { pageNum, pageSize } = params;
		let result = await ledgersBooksTable.findMultiple(`userId=${userId}`, [], pageNum, pageSize);
		let details = await ledgersDetailsTable.findAll(`userId=${userId}`, ['bookId', 'amount', 'type']);
		let statistics = (details || []).reduce((total, currentValue) => {
			let { bookId, amount, type } = currentValue;
			if (!total[bookId]) {
				total[bookId] = { expend: 0, income: 0 }
			}
			switch (type) {
				case '0': total[bookId].expend += amount; break;
				case '1': total[bookId].income += amount; break;
			}
			return total;
		}, {})
		let temp = result.data.map(item => {
			let s = statistics[item.id] || { expend: 0, income: 0 }
			return { ...item, ...s }
		})
		ctx.bodys = { ...result, data: temp };
	},
	// 查询全部数据
	findAll: async (ctx) => {
		console.log(`请求->${pathName}->查询全部数据: ${pathRoute}.findAll; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable, ledgersDetailsTable } = await instanceTable(LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE);
		// 未来待办: 这里本该使用sql语句一次性查询完成账本的收入支出统计功能(同一个账本下type有'收入','支出'两种类型),因为我还不会编写复杂的SQL语句而暂时这样处理
		let result = await ledgersBooksTable.findAll(`userId=${userId}`);
		let details = await ledgersDetailsTable.findAll(`userId=${userId}`, ['id', 'bookId', 'amount', 'type']);
		let statistics = (details || []).reduce((total, currentValue) => {
			let { bookId, amount, type } = currentValue;
			if (!total[bookId]) {
				total[bookId] = { expend: 0, income: 0 }
			}
			switch (type) {
				case '0': total[bookId].expend += amount; break;
				case '1': total[bookId].income += amount; break;
			}
			return total;
		}, {})
		let temp = result.map(item => {
			let s = statistics[item.id] || { expend: 0, income: 0 }
			return { ...item, ...s }
		})
		ctx.bodys = temp;
	},
	// 更新一条数据
	updateOne: async (ctx) => {
		console.log(`请求->${pathName}->更新一条数据: ${pathRoute}.updateOne; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			id: rules.id,
			name: rules.name,
			remark: rules.remark,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable(LEDGERS_BOOKS_TABLE);
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
			id: rules.id,
		})
		let { userId } = ctx.session.user || {};
		let { ledgersBooksTable } = await instanceTable(LEDGERS_BOOKS_TABLE);
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