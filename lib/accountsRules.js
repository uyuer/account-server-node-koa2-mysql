const verify = require('./verify');

// 参数准入规则
let accountsRules = {
    id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
    userId: [{ required: true, message: "用户id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
    site: [{ required: false, message: "" }],
    website: [{ required: true, message: "网址不可为空" }, { pattern: /^((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/, message: "请输入正确的网址" }],
    introduction: [{ required: false, message: "" }],
    account: [{ required: true, message: "账号不可为空" }],
    password: [{ required: false, message: "" }],
    associates: [{ required: false, message: "" }],
    nickname: [{ required: false, message: "" }],
    status: [{ required: false, message: "" }, { pattern: /[012]/, message: "状态参数错误" }],
    remark: [{ required: false, message: "" }],
    tags: [{ required: false, message: "" }], // 数组字符串
    pageNum: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageNum格式错误" }],
    pageSize: [{ required: false, message: "" }, { pattern: /^[1-9]\d*$/, message: "pageSize格式错误" }],
};

module.exports = verify(accountsRules);