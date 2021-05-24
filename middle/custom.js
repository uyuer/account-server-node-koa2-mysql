const { getType, isArray } = require("../lib/utils");
const { verifyFn } = require("../lib/method")
const { instanceTable } = require('../lib/method');

// 给ctx添加方法
const custom = async (ctx, next) => {
    // // 这里获取用户信息
    // let { usersTable } = await instanceTable();
    // let user = await usersTable.findOne(`id=87`, []);
    // console.log(user);
    // ctx.session.user = user;
    
    // 获取参数
    ctx.request.params = {
        GET: ctx.request.query,
        POST: ctx.request.body,
    }[ctx.request.method];

    ctx.verifyParams = (fields) => {
        let body = ctx.request.params;
        let paramsTtype = getType(body);
        let fieldsType = getType(fields);
        if (fieldsType !== paramsTtype) {
            return ctx.throw(400, '参数类型错误,期望' + fieldsType + '类型')
        }
        if (isArray(fields)) {
            return body.map(item => {
                return verifyFn(fields[0], item)
            })
        } else {
            return verifyFn(fields, body)
        }
    }
    await next();
}
module.exports = custom;