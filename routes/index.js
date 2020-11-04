const router = require("koa-router")();
const initialize = require("./initialize");
const login = require("./login");
const register = require("./register");
const users = require("./users");

const { auth } = require("../middlewares/auth");

router.prefix("/api");

router.use(initialize.routes());
router.use("/users", login.routes());
router.use("/users", auth, register.routes());
router.use("/", users.routes());

module.exports = router;
