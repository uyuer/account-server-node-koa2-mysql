const fs = require('fs');
const Excel = require('exceljs');
const moment = require('moment');
const { formatFetchAll } = require('./../../lib/utils')
const { instanceTable } = require('./../../lib/method');
const config = require("../../config")
const { USERS_TABLE, REGISTEREMAIL_TABLE, AVATARS_TABLE, ACCOUNTS_DETAILS_TABLE, ACCOUNTS_LABELS, LEDGERS_BOOKS_TABLE, LEDGERS_DETAILS_TABLE, LEDGERS_LABELS_TABLE } = config.database;

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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
		let { tableIns, dbName } = ledgersDetailsTable;
		let { bookId, start, end } = params;
		let result = await tableIns
			.getSession()
			.sql(`select * from ${dbName}.ledgers_view where bookId=${bookId} and userId=${userId} and date>='${start}' and date<='${end}' order by date DESC`)
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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
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
		let { ledgersDetailsTable } = await instanceTable(LEDGERS_DETAILS_TABLE);
		let { id, bookId } = params;
		let where = `id=${id} and bookId=${bookId} and userId=${userId}`;
		let info = await ledgersDetailsTable.findOne(where);
		if (!info) {
			return ctx.throw(400, '数据不存在');
		}
		let result = await ledgersDetailsTable.deleteOne(where);
		ctx.bodys = result;
	},

	// 解析女生记账软件app中导出的csv文件, 将数据保存在本地的数据库中, 女生记账~拜拜了
	importFile: async (ctx) => {
		console.log(`请求->${pathName}->CSV文件上传: ${pathRoute}.importFile; method: ${ctx.request.method}; url: ${ctx.request.url} `)
		let params = ctx.verifyParams({
			bookId: rules.bookId,
		})
		const maxSize = 0.5 * 1024 * 1024;
		const file = ctx.request.files.file;
		if (!file) {
			return ctx.throw(400, '导入文件不能为空');
		}
		const { path: filePath, name, type, lastModifiedDate } = file;
		// 检查上传文件是否合法, 如果非法则删除文件
		let allowedType = ['text/csv']
		if (!allowedType.find(t => t === type)) {
			fs.unlinkSync(filePath)
			return ctx.throw(400, '只支持导入文件为' + allowedType.toString() + '格式');
		}
		if (file.size > maxSize) {
			return ctx.throw(400, '上传文件过大,仅支持' + (maxSize / 1024 / 1024) + 'M以内的文件');
		}
		let { userId } = ctx.session.user || {};
		let { ledgersLabelsTable, ledgersDetailsTable } = await instanceTable(LEDGERS_LABELS_TABLE, LEDGERS_DETAILS_TABLE);
		let { bookId } = params;
		let labelsResult = await ledgersLabelsTable.findAll(`isSystemCreate=1 or creatorId=${userId}`, ['id', 'label', 'isSystemCreate', 'createTime', 'updateTime']);
		let labels = labelsResult.reduce((total, currentValue) => {
			total[currentValue.label] = currentValue.id
			return total;
		}, {})
		const workbook = new Excel.Workbook();
		const values = []
		const options = {
			map(value, index) {
				let arr = value.split(',');
				let p = {
					date: '',
					type: '',
					amount: '',
					labelId: '',
					remark: '',
					userId: '',
					bookId: '',
				}
				let obj = Object.keys(p).reduce((total, currentValue, index) => {
					let key = currentValue;
					let value = arr[index];
					switch (key) {
						case 'date':
							let str = value.replace(/[年月日]/g, '-');
							value = moment(str.substring(0, str.length - 1)).format('YYYY-MM-DD'); break;
						case 'type': value = value === '支出' ? '0' : '1'; break;
						case 'amount': value = Number(value); break;
						case 'labelId': value = labels[value]; break;
						case 'userId': value = userId; break;
						case 'bookId': value = bookId; break;
					}
					total[key] = value;
					return total;
				}, {});
				values.push(obj)
			},
			parserOptions: {
				delimiter: '\t',
				quote: true,
			},
		};
		const worksheet = await workbook.csv.readFile(filePath, options);
		let keys = Object.keys(values[0]);
		let result = await ledgersDetailsTable.addMultiple(keys, values);
		ctx.bodys = true;
	}

}
