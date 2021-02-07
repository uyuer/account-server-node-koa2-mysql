const router = require("koa-router")();
const public = require("./public");
const users = require("./users");

const { auth } = require("../../lib/auth");

router.prefix("/api"); // 添加api前缀

router.use("/users", public.routes()); // 接口: /api/users
router.use("/users", auth, users.routes()); // 接口: /api/users

module.exports = router;
