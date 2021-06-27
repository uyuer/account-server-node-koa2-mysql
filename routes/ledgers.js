const router = require('koa-router')()
const controller = require('./../controllers');

router.post('/books/addOne', controller.ledgers.books.addOne)

router.get('/books/findAll', controller.ledgers.books.findAll) // 查找用户全部账户数据

router.get('/books/findMultiple', controller.ledgers.books.findMultiple) // 查找多条数据

router.get('/books/findOne', controller.ledgers.books.findOne)

router.post('/books/updateOne', controller.ledgers.books.updateOne)

router.post('/books/deleteOne', controller.ledgers.books.deleteOne)

router.post('/details/addOne', controller.ledgers.details.addOne)

router.get('/details/findAll', controller.ledgers.details.findAll) // 查找用户全部账户数据

router.get('/details/findMultiple', controller.ledgers.details.findMultiple) // 查找多条数据

router.get('/details/findOne', controller.ledgers.details.findOne)

router.post('/details/updateOne', controller.ledgers.details.updateOne)

router.post('/details/deleteOne', controller.ledgers.details.deleteOne)

// router.post('/books/updateMultiple', controller.ledgers.books.updateMultiple)


// router.post('/books/deleteMultiple', controller.ledgers.books.deleteMultiple)

// router.post('/books/importJSONFile', controller.ledgers.books.importJSONFile)

module.exports = router