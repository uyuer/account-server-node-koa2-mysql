// 获取对象key值
exports.getObjectKey = (target) => {
	// if (typeof target !== 'object') {
	// 	throw new Error('输入参数不是一个对象');
	// }
	return Object.keys(target);
};
/**
 * @content Array 数组,指定需要取出的参数
 * @origin Object 对象,输入的参数合计
 * @description 提取对象中指定的属性
 */
exports.filterParams = (content = [], origin = {}) => {
	let params = {};
	if (!content || !content.length || !origin || typeof origin !== "object") {
		return params;
	}
	return content.reduce((total, currentValue, currentIndex, arr) => {
		total[currentValue] = origin[currentValue];
		return total;
	}, params);
};

/**
 * @content Array 数组,指定需要取出的参数
 * @origin Object 对象,输入的对象列表
 * @description 提取对象中指定的属性
 */
exports.filterRules = (content = [], rules = {}) => {
	let rule = {};
	if (!content || !content.length || !rule || typeof rule !== "object") {
		return rule;
	}
	return content.reduce((total, currentValue, currentIndex, arr) => {
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
