const router = require('koa-router')()
const controller = require('./../controllers');

router.post('/addOne', controller.accounts.addOne)

router.post('/addMultiple', controller.accounts.addMultiple)

router.get('/findAll', controller.accounts.findAll) // 查找用户全部账户数据

router.get('/findMultiple', controller.accounts.findMultiple) // 查找多条数据

router.get('/findOne', controller.accounts.findOne)

router.post('/updateOne', controller.accounts.updateOne)

router.post('/updateMultiple', controller.accounts.updateMultiple)

router.post('/deleteOne', controller.accounts.deleteOne)

router.post('/deleteMultiple', controller.accounts.deleteMultiple)

module.exports = router