const router = require("koa-router")();
const controller = require("./../controllers");

router.post("/register", controller.ordinary.register);
router.post("/login", controller.ordinary.login);
router.post("/logout", controller.ordinary.logout);
router.post("/sendcode", controller.ordinary.sendcode);

module.exports = router;
