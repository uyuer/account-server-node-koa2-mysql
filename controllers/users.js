const query = require('./index');
const R = require('./../lib/responseBeautifier');

// 新增用户
exports.insertData = async ctx => {
    console.log('参数', ctx.request.body);
    // let value = ctx.request.body;
    let value = {
        username: 'test4',
        password: '123456',
        email: '1064926205@qq.com'
    }
    let _sql = "insert into users set ?;"
    console.log(_sql)
    let res = await query(_sql, value);
    if (res) {
        console.log(R);
        ctx.response.body = R.set(res);
        // ctx.response.body = { status: 200, msg: '添加用户成功', data: res }
    }
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