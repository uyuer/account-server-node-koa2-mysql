const router = require("koa-router")();
const controller = require("./../controllers");

router.post("/register", controller.public.register);
router.post("/login", controller.public.login);
router.get("/logout", controller.public.logout);
router.post("/sendcode", controller.public.sendcode);

module.exports = router;
