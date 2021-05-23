const { getType, isArray } = require("../lib/utils");
const { verifyFn } = require("../lib/method")
// const {
//     // screeningFields, // 根据有效字段筛选出有效参数, 过滤一些用户上传的其他无关参数
//     // screeningRules, // 筛选参数对应规则
//     // verifyRules, // 校验是否符合规则
//     verifyParams, // 验证参数是否合法
// } = require("../method/verify");

// 给ctx添加方法
// 获取参数
const arguments = async (ctx, next) => {
    // // 这里获取用户信息
    // let { usersTable } = await instanceTable();
    // let user = await usersTable.findOne(`id=87`, []);
    // console.log(user);
    // ctx.session.user = user;

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
module.exports = arguments;