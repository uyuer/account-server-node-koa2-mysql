const router = require("koa-router")();
const controller = require("./../controllers/public");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/sendcode", controller.sendcode);

module.exports = router;
