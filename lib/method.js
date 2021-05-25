
const Table = require('./table.class');
const { isArray, isObject, isFunction, getType } = require("./utils");

/**
 * 格式化返回内容 在app.use(router)之前调用
 * @param {*} ctx
 */
function apiFormatter(ctx) {
    //如果有返回数据，将返回数据添加到data中
    let result = ['undefined', 'null'].includes(getType(ctx.bodys)) ? null : ctx.bodys;
    ctx.body = {
        code: 200,
        message: "success",
        data: result
    };
};

/**
 * 获取表操作实例
 * @return {*} 返回表操作实例
 */
async function instanceTable() {
    let usersTable = await Table.build('users');
    let registerEmailTable = await Table.build('registeremail');
    let avatarsTable = await Table.build('avatars');
    let accountsTable = await Table.build('accounts');
    let labelsTable = await Table.build('labels');
    return {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsTable,
        labelsTable
    }
}


/**
 * 根据规则筛选参数
 * @param {*} [fields={}]
 * @param {*} [params={}]
 * @return {*} 
 */
const screeningFields = (fields = {}, params = {}) => {
    let keys = Object.keys(fields);
    return keys.reduce((total, currentValue) => {
        total[currentValue] = params[currentValue];
        return total;
    }, {});
};

const REQUIRED = 'required', PATTERN = 'pattern', VALIDATOR = 'validator';

/**
 * 验证参数规则 
 * @param {*} [fields={}]
 * @param {*} [params={}]
 * @return {*} 
 */
const verifyRules = (fields = {}, params = {}) => {
    let keys = Object.keys(fields);
    let errors = keys.reduce((total, key, index, arr) => {
        // 这个字段对应的参数规则
        let rule = fields[key];
        // 字段值
        let value = params[key];

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
    }, []);
    return errors;
}

/**
 * 验证
 * @param {*} fields 传入的规则
 * @param {*} params 传入的参数
 * @return {*} 返回有效参数
 */
const verifyFn = (ctx, fields, params) => {
    // 这段可要可不要
    let keys = Object.keys(fields);
    if (keys && keys.length <= 0) {
        return ctx.throw(500, '校验规则为空对象');
    }
    // 筛选有效参数,为fields中指定的值
    let validParams = screeningFields(fields, params);
    let errors = verifyRules(fields, validParams);
    if (errors.length > 0) {
        return ctx.throw(400, errors[0]);
    }
    return validParams
};

module.exports = {
    apiFormatter,
    instanceTable,
    screeningFields,
    verifyRules,
    verifyFn,
}