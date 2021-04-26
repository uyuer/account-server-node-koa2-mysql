const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const koaLogger = require("koa-logger");
const koaBody = require("koa-body");

const config = require('./config');

const loggerLib = require("./lib/logger.lib");
const sessionLib = require('./lib/session.lib');
const tokenLib = require('./lib/token.lib');
const responseFormatter = require('./lib/responseFormatter');
const front = require("./front/routes/index");
const backRoute = require("./back/routes/index");

console.log('NODE_ENV:', process.env.NODE_ENV)

app.use(
	koaBody({
		multipart: true,
		formidable: {
			multipart: true,
			keepExtensions: true,
			uploadDir: config.upload.avatarFullPath,
			// onFileBegin: (name, file) => {
			// 	console.log(name, '123')
			// 	console.log(file, '123')
			// 	file.path = file.path

			// }
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

//添加格式化处理响应结果的中间件，在添加路由之前调用
//仅对/api开头的url返回内容进行格式化处理
app.use(responseFormatter('^/api'));
// routes
app.use(front.routes(), front.allowedMethods());

// 发送HTML页面
app.use(async (ctx) => {
	let url = ctx.request.url;
	let html = await backRoute(url);
	ctx.body = html;
})

module.exports = app;
