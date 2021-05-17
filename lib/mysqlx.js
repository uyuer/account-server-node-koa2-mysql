var mysqlx = require('@mysql/xdevapi');
const config = require('../config');
const { database = {} } = config;

var session = mysqlx.getSession({
    host: database.HOST,
    port: database.PORT,
    user: database.USERNAME,
    password: database.PASSWORD,
}); // 是一个Promise

var schema = session.then(s => s.getSchema(database.DATABASE)) // 是一个Primise

module.exports = {
    session,
    schema
};