const router = require("koa-router")();
const controller = require("./../controllers/public");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/loginOut", controller.loginOut);

module.exports = router;
