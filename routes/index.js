const router = require("koa-router")();
const ordinary = require("./ordinary");
const users = require("./users");
const accounts = require("./accounts");
const labels = require("./labels");
const ledgers = require("./ledgers");
// const middle = require("../middle");

router.prefix("/api"); // 添加api前缀

router.use("/users", ordinary.routes()); // 接口: /api/users
router.use("/users", users.routes()); // 接口: /api/users
router.use("/accounts", accounts.routes()); // 接口: /api/accounts
router.use("/labels", labels.routes()); // 接口: /api/accounts
router.use("/ledgers", ledgers.routes()); // 接口: /api/ledgers

module.exports = router;
