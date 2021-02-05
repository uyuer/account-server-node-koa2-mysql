var mysqlx = require('@mysql/xdevapi');

var session = mysqlx.getSession({
    host: 'localhost',
    port: 33060,
    user: 'accounts1Admin',
    password: 'adgjmptw123',
}); // 是一个Promise

var schema = session.then(s => s.getSchema('accounts1')) // 是一个Primise

module.exports = {
    session,
    schema
};