const router = require("koa-router")();
const controller = require("./../controllers/initialize");

router.post("/", controller.initialize);

module.exports = router;
