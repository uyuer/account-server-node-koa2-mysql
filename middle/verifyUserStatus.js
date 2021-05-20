const { verifyUserStatus } = require('../method');

// 中间件
// 校验用户状态
const verifyUser = async (ctx, next) => {
    const session = ctx.session;
    const { userId } = session || {};
    let user = await verifyUserStatus(userId)
    console.log('真实用户', user)
    return next();
}
module.exports = verifyUser;