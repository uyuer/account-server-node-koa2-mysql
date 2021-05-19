const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const koaLogger = require("koa-logger");
const koaBody = require("koa-body");
// const error = require("koa-json-error");
// const parameter = require("koa-parameter");

const config = require('./config');

const loggerLib = require("./lib/logger");
const sessionLib = require('./lib/session');
const tokenLib = require('./lib/token');
const middle = require('./lib/middle');
const apiFormatter = require('./lib/apiFormatter');
const routes = require("./routes/index");

console.log('NODE_ENV:', process.env.NODE_ENV)
// TODO:文件绝对路径问题
// ...
// app.use(async (ctx, next) => {
// 	ctx.verify = () => {
// 		console.log(123)
// 	}
// 	await next()
// })
app.use(
	koaBody({
		multipart: true,  // 支持文件上传
		// encoding:'gzip',
		formidable: {
			keepExtensions: true, // 保持文件的后缀
			maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
			// uploadDir: config.upload.avatarFullPath,
			uploadDir: config.uploadTmp, // 设置文件上传目录
			// onFileBegin: (name, file) => { // 文件上传前的设置
			// 	console.log(`name: ${name}`);
			// 	console.log(file);
			// },
		},
	})
);
app.use(json());

app.use(require("koa-static")(__dirname + "/public"));
app.use(require("koa-static")(__dirname + "/uploads"));
app.use(
	views(__dirname + "/views", {
		extension: "pug",
	})
);

// 日志记录
app.use(koaLogger());
app.use(loggerLib);

// session配置
app.keys = [config.SECRET];
app.use(sessionLib(app));

// token配置
app.use(tokenLib.gatherToken);
app.use(tokenLib.authToken);
app.use(tokenLib.unless);

// 定义了一些和ctx有关的全局方法
app.use(middle.userInfo)
app.use(middle.arguments)
app.use(middle.valid)

//添加格式化处理响应结果的中间件，在添加路由之前调用
//仅对/api开头的url返回内容进行格式化处理
app.use(apiFormatter('^/api'));
// routes
app.use(routes.routes(), routes.allowedMethods());

app.use(async (ctx, next) => {
	if (ctx.status === 404) {
		ctx.throw(404, 'Not Found')
	}
})

app.on('error', (err, ctx) => {
	console.log('捕获到错误信息', err.status, ctx.status);
	console.log(err)
	ctx.body = {
		code: err.status || 500,
		message: err.message || '异常错误',
		data: null,
	}
});
// // 发送HTML页面
// app.use(async (ctx) => {
// 	let url = ctx.request.url;
// 	let html = await backRoute(url);
// 	ctx.body = html;
// })

module.exports = app;
