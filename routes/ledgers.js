const router = require('koa-router')()
const controller = require('./../controllers');

// const arr = [
//     { route: '/api/ledgers/books/addOne', method: 'POST', handler: controller.ledgers.books.addOne }
// ]

router.post('/books/addOne', controller.ledgers.books.addOne)
router.get('/books/findOne', controller.ledgers.books.findOne)
router.get('/books/findAll', controller.ledgers.books.findAll)
router.get('/books/findMultiple', controller.ledgers.books.findMultiple)
router.post('/books/updateOne', controller.ledgers.books.updateOne)
router.post('/books/deleteOne', controller.ledgers.books.deleteOne)

router.post('/details/addOne', controller.ledgers.details.addOne)
router.post('/details/addMultiple', controller.ledgers.details.addMultiple)
router.get('/details/findAll', controller.ledgers.details.findAll)
router.post('/details/updateOne', controller.ledgers.details.updateOne)
router.post('/details/updateMultiple', controller.ledgers.details.updateMultiple)
router.post('/details/deleteOne', controller.ledgers.details.deleteOne)
router.post('/details/importFile', controller.ledgers.details.importFile)
// router.post('/books/deleteMultiple', controller.ledgers.books.deleteMultiple)

router.post('/labels/addOne', controller.ledgers.labels.addOne)
router.get('/labels/findAll', controller.ledgers.labels.findAll)
router.post('/labels/updateOne', controller.ledgers.labels.updateOne)
router.post('/labels/deleteOne', controller.ledgers.labels.deleteOne)
module.exports = router