const { filterParams, filterRules, isFunction } = require("./utils");

/**
 * 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
 * @param {*} [fields={}]
 * @param {*} [params={}]
 * @return {*} 
 */
function screeningFields(fields = {}, params = {}) {
    let validParams = Object.keys(fields).reduce((total, key, index, arr) => {
        total[key] = params[key] === null || params[key] === undefined ? fields[key] : params[key];
        return total;
    }, {})
    return validParams;
}

/**
 * 筛选参数对应规则
 * @param {*} [params={}]
 * @param {*} [rules={}]
 * @return {*} 参数字段的对应规则
 */
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

const REQUIRED = 'required', PATTERN = 'pattern', VALIDATOR = 'validator';
/**
 * 校验是否符合规则
 * @param {*} [params={}]
 * @param {*} [rules={}]
 * @return {*} 错误列表
 */
function verifyRules(params = {}, rules = {}) {
    let keys = Object.keys(params);
    if (keys && keys.length <= 0) {
        return false;
    }
    let errors = keys.reduce((total, fields, index, arr) => {
        // 字段值
        let value = params[fields];
        // 这个字段对应的参数规则
        let rule = rules[fields];
        let error = '';
        let result = rule.every((r) => {
            let { message } = r;
            // required 必填项
            if (r.hasOwnProperty(REQUIRED) && r[REQUIRED] && !value) {
                error = message;
                return false;
            }
            if (r.hasOwnProperty(PATTERN) && value) {
                var patt = new RegExp(r[PATTERN]);
                if (!patt.test(value)) {
                    error = message;
                    return false;
                }
            }
            if (r.hasOwnProperty(VALIDATOR) && value) {
                let validator = r[VALIDATOR];
                if (validator && isFunction(validator)) {
                    let { result, message } = validator(value);
                    error = message;
                    return result;
                }
            }
            return true;
        });
        if (!result) {
            total.push(error);
        }
        return total;
    }, [])
    return errors;
}

/**
 *
 * 验证参数是否合法
 * @param {*} fields
 * @param {*} params
 * @param {*} rulesList
 * @param {boolean} [isThrow=false]
 * @return {*} 
 */
function verifyParams(fields, params, rulesList) {
    // 筛选有效参数
    let validParams = screeningFields(fields, params);
    // 筛选参数规则
    let rules = screeningRules(validParams, rulesList); // 筛选对应规则
    // 校验有效参数是否合法
    let errors = verifyRules(validParams, rules);

    return { errors, validParams };
}

module.exports = {
    screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
    screeningRules, // 筛选参数对应规则
    verifyRules, // 校验是否符合规则
    verifyParams, // 验证参数是否合法
}
