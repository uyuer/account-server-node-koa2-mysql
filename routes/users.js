const router = require('koa-router')()
const controller = require('./../controllers/users');

router.prefix('/users')

router.post('/add', controller.insertData)

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
