const router = require('koa-router')()
const controller = require('./../controllers/initialize');
console.log(controller)

router.post('/initialize', controller.initialize)

module.exports = router
