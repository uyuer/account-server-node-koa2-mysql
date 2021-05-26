const { getType, isArray } = require("../lib/utils");
const { instanceTable } = require('../lib/method');

// 给ctx添加方法
const userVerifyUnless = (params) => {
    let { path } = params || {};
    return async (ctx, next) => {
        // 是否是 无需用户状态验证的路径[不是:true 是:false]
        let result = path.every((p => {
            if (!p.test(ctx.request.path)) {
                return true;
            } else {
                return false;
            }
        }))
        // 如果不是被排除路径, 则需要验证用户状态, 当用户状态为冻结|
        if (result) {
            let { userId } = ctx.session.user || {};
            console.log('需要验证用户状态', userId, ctx.request.path);
            let { usersTable } = await instanceTable();
            let user = await usersTable.findOne(`id=${userId}`, ['id', 'email', 'username', 'male', 'avatarId', 'active', 'status', 'role', 'createTime', 'updateTime']);
            // 检查用户是否存在
            if (!user) {
                return ctx.throw(403, '未知用户')
            }
            // 检查用户是否激活 (可能情况:添加了管理员, 但管理员未认证激活邮箱)
            if (!user.active) {
                return ctx.throw(403, '账户未激活, 请认证邮箱后再操作')
            }
            // 检查用户状态是否正常
            if ([0, 2, 3, 4, 5].includes(user.status)) {
                let status = [
                    '账户已冻结, 请前往个人中心激活',
                    '用户已注销',
                    '账户已被管理员冻结',
                    '用户已注销',
                    '账户异常已被系统冻结',
                ];
                return ctx.throw(403, status[user.status])
            }
            return await next();
        } else {
            console.log('无需验证用户状态, 跳过', ctx.request.path)
            return await next();
        }
    }
}
module.exports = userVerifyUnless({
    path: [
        /^\/api\/users\/register/,
        /^\/api\/users\/sendcode/,
        /^\/api\/users\/login/,
        /^\/api\/users\/logout/,
        /^\/api\/users\/findOne/,
    ]
});