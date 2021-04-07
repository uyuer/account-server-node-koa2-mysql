const email = 'uyuers@qq.com';
const pass = 'fweqxtkyzlnbbech';

const emailOptions = {
    // host: 'smtp.qq.email',
    service: 'qq',
    secureConnection: true,
    auth: {
        user: email,
        pass: pass,  //这个是开启`POP3/SMTP/IMAP`的授权码
    }
}

const codeValidTime = 1800; // 秒; 30分钟内有效

module.exports = {
    email,
    emailOptions,
}