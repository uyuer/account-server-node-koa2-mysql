// 给ctx添加方法
// 获取参数
const arguments = async (ctx, next) => {
    ctx.arguments = function () {
        let params = {
            GET: ctx.request.query,
            POST: ctx.request.body,
        }[ctx.request.method];
        return params;
    }
    await next();
}
module.exports = arguments;