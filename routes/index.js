const router = require('koa-router')()
const controller = require('./../controllers/initialize');
console.log(controller)

router.get('/initialize', controller.initialize)

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
