require('dotenv').config('./env');

const {
    SECRET,
    PORT,
} = process.env;

const path = require('path')
// 上传文件临时位置
const rootPath = path.resolve('.')
// const rootPath = path.resolve() // 与上面等同
// const uploadTmp = path.resolve('.', './tmp')
// const uploadTmp = path.resolve('.', 'tmp')
// const uploadTmp = path.resolve('./tmp') // 与上面等同

const database = require('./database');
const upload = require('./upload');
const email = require('./email');

// 配置, 从全局变量中读取数据
module.exports = {
    port: PORT, // 项目启动端口
    database,
    upload,
    email,
    SECRET,
    rootPath,
}
