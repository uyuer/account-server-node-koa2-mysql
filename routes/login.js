const router = require("koa-router")();
const controller = require("./../controllers/login");

router.post("/login", controller.login);

module.exports = router;
