const router = require("koa-router")();
const ordinary = require("./ordinary");
const users = require("./users");
const accounts = require("./accounts");

const { auth } = require("../../lib/auth");

router.prefix("/api"); // 添加api前缀

router.use("/users", ordinary.routes()); // 接口: /api/users
router.use("/users", auth, users.routes()); // 接口: /api/users
router.use("/accounts", auth, accounts.routes()); // 接口: /api/accounts

module.exports = router;
