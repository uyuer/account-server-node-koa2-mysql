// ledger参数准入规则
let rules = {
    bookId: [{ required: true, message: "账本id不可为空" }, { pattern: /^[1-9]\d*$/, message: "账本id格式错误" }],
    userId: [{ required: true, message: "用户id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
    name: [{ required: true, message: "账本名不可为空" }, { length: 50, message: "账本名超出限制长度" }],
    remark: [{ required: false, message: "" }],

    labelId: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
    label: [{ required: true, message: "标签不可为空" }],
};

module.exports = rules;