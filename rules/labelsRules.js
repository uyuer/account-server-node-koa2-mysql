const verify = require('./verify');

// 参数准入规则
let labelsRules = {
    id: [{ required: true, message: "数据id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
    label: [{ required: true, message: "标签不可为空" }],
    creatorId: [{ required: true, message: "创建者用户id不可为空" }, { pattern: /^[1-9]\d*$/, message: "用户id格式错误" }],
};

module.exports = verify(labelsRules);