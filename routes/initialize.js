const router = require("koa-router")();
const controller = require("./../controllers/initialize");

router.post("/initialize", controller.initialize);

module.exports = router;
