const router = require('koa-router')()
const koaBody = require("koa-body");
const controller = require('./../controllers/users');


// router.post('/add', controller.insertUser)

// router.post('/delete', controller.deleteOneUser)

router.post('/updateOne', controller.updateOne)

router.get('/findOne', controller.findOne)

// router.get('/findMultiple', controller.findMultipleUser)

router.post('/uploadProfilePicture', controller.uploadProfilePicture)

module.exports = router
