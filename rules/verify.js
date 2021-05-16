const ApiError = require("../lib/apiError.lib");
const ApiErrorNames = require("../lib/apiErrorNames");
const { filterParams, filterRules, isFunction } = require("../lib/utils");

module.exports = (Rules) => {
    // 筛选参数对应规则
    function screeningRules(params = {}, rules = {}) {
        let fields = Object.keys(params);
        let rule = {};
        if (fields && fields.length) {
            rule = fields.reduce((total, currentValue, currentIndex, arr) => {
                total[currentValue] = rules[currentValue];
                return total;
            }, rule);
        }
        return rule;
    };

    // 校验是否符合规则
    function verifyRules(params = {}, rules = {}) {
        let errorMessage = '', errorType = ApiErrorNames.ERROR_PARAMS, checkResult = false;
        let keys = Object.keys(params); // fields ? fields :
        if (keys && keys.length) {
            checkResult = keys.every((key) => {
                let value = params[key];
                let rule = rules[key];
                if (!rule) return true;
                return rule.every((item) => {
                    if (item.hasOwnProperty("required")) {
                        if (item.required && !value) {
                            errorMessage = item.message;
                            return false;
                        }
                    }
                    if (item.hasOwnProperty("pattern") && value) {
                        var patt = new RegExp(item.pattern);
                        if (!patt.test(value)) {
                            errorMessage = item.message;
                            return false;
                        }
                    }
                    if (item.hasOwnProperty('validator') && value) {
                        if (item.validator && isFunction(item.validator)) {
                            let { result, message } = item.validator(value);
                            errorMessage = message
                            return result;
                        }
                    }
                    return true;
                });
            })
        } else {
            checkResult = false;
            errorMessage = '参数不可为空';
        }
        return {
            checkResult, // 检查结果
            errorMessage, // 错误提示
            errorType, //错误类型
        };
    }

    // 验证参数是否合法
    function verifyParams(fields, params, isThrow = false) {
        // 筛选有效参数
        let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
            total[key] = params[key] === null || params[key] === undefined ? fields[key] : params[key];
            return total;
        }, {})
        // 筛选参数规则
        let rules = screeningRules(validParams, Rules); // 筛选对应规则
        // 校验有效参数是否合法
        let { checkResult, errorMessage, errorType } = verifyRules(validParams, rules);
        if (!checkResult) {
            if (isThrow) {
                return false;
            } else {
                throw new ApiError(errorType, errorMessage);
            }
            // if (errorCallBack && typeof errorCallBack === 'function') {
            //     errorCallBack();
            // } else {
            //     throw new ApiError(errorType, errorMessage);
            // }
        }
        return validParams;
    }

    return {
        rules: Rules, // 参数规则
        screeningRules, // 筛选参数对应规则
        verifyRules, // 校验是否符合规则
        verifyParams, // 验证参数是否合法
    }
}
