const router = require('koa-router')()
const controller = require('./../controllers/users');

router.prefix('/users')

router.post('/add', controller.insertUser)

router.post('/delete', controller.deleteOneUser)

router.get('/findOne', controller.findOneUser)

router.get('/findMultiple', controller.findMultipleUser)

module.exports = router
