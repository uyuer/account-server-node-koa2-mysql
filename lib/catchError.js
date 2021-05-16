const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log('这里是没有处理的错误', error, error.message)
        ctx.body = {
            code: 500,
            message: '未知错误:' + error.message,
            data: false,
        };
    }
}
module.exports = catchError;