const nodemailer = require('nodemailer')
const config = require('../config');
const { email, pass, codeValidTime } = config.email;

const emailOptions = {
    // host: 'smtp.qq.email',
    service: 'qq',
    secureConnection: true,
    auth: {
        user: email,
        pass: pass,  //这个是开启`POP3/SMTP/IMAP`的授权码
    }
};
const transporter = nodemailer.createTransport(emailOptions);

exports.transporter = transporter;

exports.sendEmailCode = async (toEmail, code) => {
    if (!toEmail || !code) {
        return Promise.reject({ message: '邮箱和验证码不能为空' })
    }
    const mailOptions = {
        from: email,
        cc: email,
        to: toEmail, // 目标邮箱
        subject: '验证码',
        text: '说明内容',
        html: `<h2>【个人网站】</h2>验证码：<span>${code}</span>`
    }
    return transporter.sendMail(mailOptions)
}