// 给ctx添加方法
// 获取用户session信息
const userinfo = async (ctx, next) => {
    ctx.userinfo = function (name) {
        if (name) {
            return ctx.session[name]
        }
        return ctx.session;
    }
    await next();
}
module.exports = userinfo