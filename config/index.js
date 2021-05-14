require('dotenv').config('./env');

const {
    SECRET,
    PORT,
} = process.env;

// 上传文件临时位置
const uploadTmp = './tmp';

const database = require('./database');
const upload = require('./upload');
const email = require('./email');

// 配置, 从全局变量中读取数据
module.exports = {
    database,
    upload,
    email,
    SECRET,
    port: PORT, // 项目启动端口
    uploadTmp,
}
