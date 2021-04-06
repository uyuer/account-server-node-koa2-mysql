const router = require('koa-router')()
const koaBody = require("koa-body");
const controller = require('./../controllers');


// router.post('/add', controller.users.insertUser)

// router.post('/delete', controller.users.deleteOneUser)

router.post('/updateOne', controller.users.updateOne)

router.get('/findOne', controller.users.findOne)

// router.get('/findMultiple', controller.users.findMultipleUser)

router.post('/uploadProfilePicture', controller.users.uploadProfilePicture)

module.exports = router
