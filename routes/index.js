const router = require("koa-router")();
const initialize = require("./initialize");
const login = require("./login");
const register = require("./register");
const users = require("./users");

const { auth } = require("../middlewares/auth");

router.prefix("/api"); // 添加api前缀

router.use("/initialize",initialize.routes()); // 接口: /api/initialize
router.use("/users", login.routes()); // 接口: /api/users
router.use("/users", auth, register.routes()); // 接口: /api/users
router.use("/users", auth, users.routes()); // 接口: /api/users

module.exports = router;
