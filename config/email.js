require('dotenv').config('./env');

const {
    E_MAIL,
    E_PASS,
} = process.env

const email = E_MAIL;
const pass = E_PASS;
const codeValidTime = 1800; // 邮箱验证码有效时间 秒; 30分钟内有效

module.exports = {
    email,
    pass,
    codeValidTime,
}