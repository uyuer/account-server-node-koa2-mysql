const router = require('koa-router')()
const koaBody = require("koa-body");
const controller = require('./../controllers/accounts');

router.post('/addOne', controller.addOne)
router.get('/findMultiple', controller.findMultiple) // 查找多条数据


// router.post('/delete', controller.deleteOneUser)

// router.post('/updateOne', controller.updateOne)

// router.get('/findOne', controller.findOne)


// router.post('/uploadProfilePicture', controller.uploadProfilePicture)

module.exports = router
