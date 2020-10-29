const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const logger = require("koa-logger");
const koaBody = require("koa-body");
const koaSession = require("koa-session"); // 导入koa-session
const onerror = require("koa-onerror");


const index = require("./routes/index");
const users = require("./routes/users");
const R = require("./lib/responseBeautifier");
const logUtil = require("./lib/logUtil");

// session配置
const session_signed_key = ["some secret hurr"]; // 这个是配合signed属性的签名key
const session_config = {
	key: "koa:sess" /**  cookie的key。 (默认是 koa:sess) */,
	maxAge: 3600000 /**  session 过期时间，以毫秒ms为单位计算 。*/,
	autoCommit: true /** 自动提交到响应头。(默认是 true) */,
	overwrite: true /** 是否允许重写 。(默认是 true) */,
	httpOnly: true /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */,
	signed: true /** 是否签名。(默认是 true) */,
	rolling: true /** 是否每次响应时刷新Session的有效期。(默认是 false) */,
	renew: false /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */,
};
const session = koaSession(session_config, app);

// onerror(app);
app.keys = session_signed_key;

// 登录判断
// app.use(async (ctx, next) => {
// 	console.log('请求')
// 	// if (ctx.session.logged) {
// 		await next();
// 	// } else {
// 	// 	return (ctx.response.body = R.set(false, "200", "未登录"));
// 	// }
// });

// app.use(session);

app.use(
	koaBody({
		multipart: true,
		formidable: {
			uploadDir: __dirname + "/uploads",
		},
	})
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));
app.use(
	views(__dirname + "/views", {
		extension: "pug",
	})
);
// logger
app.use(async (ctx, next) => {
	// 响应开始时间
	const start = new Date();
	// 响应间隔时间
	var ms;
	try {
		//开始进入到下一个中间件
		await next();
		ms = new Date() - start;
		// 记录响应日志
		logUtil.logResponse(ctx, ms);
	} catch (error) {
		ms = new Date() - start;
		// 记录异常日志
		logUtil.logError(ctx, error, ms);
	}
});
// 初始化
// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (error, ctx) => {
	console.error("server error");
	ctx.response.body = R.set(
		{
			code: error.code,
			errno: error.errno,
			sqlMessage: error.sqlMessage,
			sql: error.sql,
		},
		"500",
		"未知异常"
	);
});

module.exports = app;
