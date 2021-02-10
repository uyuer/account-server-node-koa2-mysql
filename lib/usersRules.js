const ApiErrorNames = require("../lib/apiErrorNames");
const { filterParams, filterRules } = require("../lib/utils");
// 用户表字段可入表规则
// 用户表部分字段默认参数
let defaultValue = {
    male: "-1",
    avatar: "",
    status: "1",
};

// 用户表数据准入规则
let Rules = {
    id: [
        { required: true, message: "用户id不可为空" },
        { pattern: /^[1-9]\d*$/, message: "用户id格式错误" },
    ],
    username: [
        { required: true, message: "用户名不可为空" },
        { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/, message: "用户名由2~20位中文、英文、数字和下划线字符组成" },
    ],
    password: [
        { required: true, message: "密码不可为空" },
        { pattern: /^[\w\.\!]{6,18}$/, message: "密码由6~18位A~Za~z0~9_!.的字符组成" },
    ],
    repassword: [
        { required: true, message: "重复密码不可为空" },
        { pattern: /^[\w\.\!]{6,18}$/, message: "重复密码由6~18位A~Za~z0~9_!.的字符组成" },
    ],
    male: [
        { required: false, message: "" },
        { pattern: /[-101]/, message: "性别参数错误" },
    ],
    avatar: [{ required: false, message: "头像不可为空" }],
    email: [
        { required: true, message: "邮箱不可为空", },
        { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "邮箱格式错误" },
    ],
    status: [
        { required: true, message: "状态不可为空" },
        { pattern: /[-101]/, message: "状态参数错误" },
    ],
};

function checkField(fields, body) {
    console.log()
    let params = filterParams(fields, body); // 获取指定参数
    let rules = filterRules(fields, Rules); // 获取参数对应规则
    return checkRules(params, rules, fields);
}

function checkRules(params = {}, rules = {}, fields) {
    let errorMessage = '', errorType = ApiErrorNames.ERROR_PARAMS, checkResult = false;
    let keys = Object.keys(params); // fields ? fields :
    if (keys && keys.length) {
        checkResult = keys.every((key) => {
            let value = params[key];
            let rule = rules[key];
            if (!rule) {
                return true;
            }
            return rule.every((item) => {
                // if (item.hasOwnProperty("defaultValue")) {
                // 	if (!value) {
                // 		value = item.defaultValue;
                // 	}
                // }
                if (item.hasOwnProperty("required")) {
                    if (item.required && !value) {
                        errorMessage = item.message;
                        return false;
                    }
                }
                if (item.hasOwnProperty("pattern")) {
                    var patt = new RegExp(item.pattern);
                    if (!patt.test(value)) {
                        errorMessage = item.message;
                        return false;
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

module.exports = {
    usersRules: Rules,
    checkRules,
    checkField,
};