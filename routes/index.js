const router = require("koa-router")();
const ordinary = require("./ordinary");
const users = require("./users");
const accounts = require("./accounts");
const labels = require("./labels");

router.prefix("/api"); // 添加api前缀

router.use("/users", ordinary.routes()); // 接口: /api/users
router.use("/users", users.routes()); // 接口: /api/users
router.use("/accounts", async (ctx, next) => {
    // console.log('先执行这里的中间件')
    await next();
}, accounts.routes()); // 接口: /api/accounts
router.use("/labels", labels.routes()); // 接口: /api/accounts

module.exports = router;
