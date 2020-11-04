const router = require("koa-router")();
const controller = require("./../controllers/register");

router.post("/register", controller.register);

module.exports = router;
