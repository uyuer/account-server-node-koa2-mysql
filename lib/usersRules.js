const verify = require('./verify');

// 用户表数据准入规则
let userRules = {
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
    ],
    repassword: [
        { required: true, message: "重复密码不可为空" },
        // { pattern: /^[\w\.\!]{6,18}$/, message: "重复密码由6~18位A~Za~z0~9_!.的字符组成" },
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
    code: [
        { required: true, message: "验证码不可为空" },
        { pattern: /^\d{4}$/, message: "验证码输入错误" },
    ]
};

module.exports = verify(userRules);