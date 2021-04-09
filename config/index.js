require('dotenv').config('./env');

const {
    SECRET
} = process.env;

const database = require('./database');
const upload = require('./upload');
const email = require('./email');

module.exports = {
    port: 3000, // 项目启动端口
    SECRET,
    database,
    upload,
    email,
}
