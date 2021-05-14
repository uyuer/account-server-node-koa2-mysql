const router = require('koa-router')()
const controller = require('./../controllers');

router.post('/addOne', controller.labels.addOne)

router.post('/updateOne', controller.labels.updateOne)

router.get('/findAll', controller.labels.findAll) // 查找用户全部账户数据

module.exports = router

