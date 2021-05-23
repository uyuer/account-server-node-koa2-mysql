const { verifyUserStatus, instanceTable } = require('../method');

// 中间件
// 校验用户是否存在
const verifyUser = async (ctx, next) => {
    const session = ctx.session;
    const { userId } = session || {};
    // console.log(userId)
    let user = await verifyUserStatus(userId);
    console.log(user)
    // if (user) {
    //     let { id: userId } = user;
    //     // let {}instanceTable()
    //     console.log('真实用户:', user.username, 'id:', user.id)
    //     ctx.session.privates = user;

    // } else {
    //     console.log('发生肾么事了? 怎么回事?')
    // }
    // console.log(ctx.session.privates)
    // console.log('-----------------')
    return next();
}
module.exports = verifyUser;