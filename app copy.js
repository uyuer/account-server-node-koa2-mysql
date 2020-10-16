const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

// const initTables = require('./lib/initTables')
const index = require("./routes/index");
const users = require("./routes/users");

const R = require("./lib/responseBeautifier");

// error handler
onerror(app);
// middlewares
app.use(
	bodyparser({
		enableTypes: ["json", "form", "text"],
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
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
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
