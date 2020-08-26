const query = require('./index');
// 新增用户
exports.insertData = async ctx => {
    console.log('参数', ctx.request.body, ctx.body);
    let _sql = "insert into users set username=?,password=?,male=?,avatar=?,email=?;"
    // return query(_sql, value)
    ctx.body = '123'
}
// 删除用户
exports.deleteUserData = (username) => {
    let _sql = `delete from users where username="${username}";`
    return query(_sql)
}
// 查找用户
exports.findUserData = (username) => {
    let _sql = `select * from users where username="${username}";`
    return query(_sql)
}