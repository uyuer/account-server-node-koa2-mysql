var fs = require('fs');

// 获取对象key值
exports.getObjectKey = (target) => {
	// if (typeof target !== 'object') {
	// 	throw new Error('输入参数不是一个对象');
	// }
	return Object.keys(target);
};
/**
 * @fields Array 数组,指定需要取出的参数字段
 * @origin Object 对象,输入的参数合计
 * @description 提取对象中指定的属性, 将包含在fidlds中的字段全部取出
 */
exports.filterParams = (fields = [], origin = {}) => {
	let params = {};
	if (!fields || !fields.length || !origin || typeof origin !== "object") {
		return params;
	}
	return fields.reduce((total, currentValue, currentIndex, arr) => {
		total[currentValue] = origin[currentValue];
		return total;
	}, params);
};

/**
 * @fields Array 数组,指定需要取出的参数
 * @origin Object 对象,输入的对象列表
 * @description 提取对象中指定的属性
 */
exports.filterRules = (fields = [], rules = {}) => {
	let rule = {};
	if (!fields || !fields.length || !rule || typeof rule !== "object") {
		return rule;
	}
	return fields.reduce((total, currentValue, currentIndex, arr) => {
		total[currentValue] = rules[currentValue];
		return total;
	}, rule);
};

// 检查项是否为空值
exports.checkParams = async (rules, params) => {
	return new Promise((resolve, reject) => {
		let result = rules.every((key) => {
			if (params[key]) {
				return true;
			}
			return false;
		});
		resolve(result);
	});
};

// 过滤值, 返回对象合集
// preinstall: 预设插入数据(数据表中可操作的数据)
// params: 用户请求参数
// type:
// 1: 将[预设插入数据]中列举字段在[用户请求参数]中找到对应值并返回,找不到则置空返回;
// 2: 将[用户请求参数]过滤掉无效字段(可能上传无关字段)然后返回;(预设插入数据与用户请求参数,返回用[户请求参数]与[预设插入数据]的交集)
// exports.filterParams = (preinstall, params, type = 1) => {
// 	let temp = {};
// 	preinstall.map((key) => {
// 		if (type === 1) {
// 			temp[key] = params[key] || "";
// 		}
// 		if (type === 2) {
// 			if (params.hasOwnProperty(key)) {
// 				temp[key] = params[key];
// 			}
// 		}
// 	});
// 	return temp;
// };

// 检查对象是否有指定属性
// preinstall: 指定属性
// params: 被检查对象
exports.hasAttribute = (preinstall, params) => {
	let result = preinstall.every((key) => {
		if (params.hasOwnProperty(key)) {
			return true;
		}
		return false;
	});
	return result;
};

/**
 * 确定目录是否存在
 * pathStr: 路径
 * isCreate: 是否创建该目录, 默认false不创建
 */
exports.confirmPath = function (pathStr, isCreate = false) {
	if (fs.existsSync(pathStr)) {
		return true;
	}
	if (isCreate) {
		fs.mkdirSync(pathStr);
		console.log('createPath: ' + pathStr);
		return true;
	}
	return false;
}

// 对某一数据格式化
exports.formatFetch = (s) => {
	console.log(123)
	let values = s.fetchOne();
	if (!values) {
		debugger
		return undefined;
	}
	let columns = s.getColumns();
	let data = columns.reduce((total, currentValue, index, arr) => {
		let key = currentValue.getColumnName();
		total[key] = values[index];
		return total;
	}, {})
	return data;
}
// 对某一数据格式化
exports.formatFetchAll = (s) => {
	let values = s.fetchAll();
	if (!values || !values.length) {
		return [];
	}
	let columns = s.getColumns().map((item) => item.getColumnName())
	let data = values.map(item => {
		let temp = {};
		item.map((v, i) => {
			temp[columns[i]] = v;
		})
		return temp
	})
	return data;
}
