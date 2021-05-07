require('dotenv').config('./env');

const {
    E_MAIL,
    E_PASS,
} = process.env

const CODEVALIDTIME = 1800; // 邮箱验证码有效时间 秒; 30分钟内有效

module.exports = {
    E_MAIL,
    E_PASS,
    CODEVALIDTIME,
}