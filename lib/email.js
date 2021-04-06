const nodemailer = require('nodemailer')
const { email, emailOptions } = require('../config/emailConfig');

const transporter = nodemailer.createTransport(emailOptions)

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