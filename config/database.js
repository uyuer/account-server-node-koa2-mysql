// require('dotenv').config('./env');

const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_INSECUREAUTH,
} = process.env;

module.exports = {
    HOST: DB_HOST, //服务器ip
    PORT: DB_PORT, //mysql端口号
    DATABASE: DB_NAME, //数据库名称
    USERNAME: DB_USERNAME, //mysql用户名
    PASSWORD: DB_PASSWORD, //mysql密码
}