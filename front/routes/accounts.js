const router = require('koa-router')()
const koaBody = require("koa-body");
const controller = require('./../controllers/accounts');

router.post('/addOne', controller.addOne)

router.get('/findMultiple', controller.findMultiple) // 查找多条数据

router.get('/findOne', controller.findOne)

router.post('/updateOne', controller.updateOne)

router.post('/deleteOne', controller.deleteOne)

module.exports = router
