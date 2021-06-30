const router = require('koa-router')()
const controller = require('./../controllers');

router.post('/details/addOne', controller.accounts.details.addOne)
router.post('/details/addMultiple', controller.accounts.details.addMultiple)
router.get('/details/findAll', controller.accounts.details.findAll)
router.get('/details/findMultiple', controller.accounts.details.findMultiple)
router.get('/details/findOne', controller.accounts.details.findOne)
router.post('/details/updateOne', controller.accounts.details.updateOne)
router.post('/details/updateMultiple', controller.accounts.details.updateMultiple)
router.post('/details/deleteOne', controller.accounts.details.deleteOne)
router.post('/details/deleteMultiple', controller.accounts.details.deleteMultiple)
router.post('/details/importJSONFile', controller.accounts.details.importJSONFile)

router.post('/labels/addOne', controller.accounts.labels.addOne)
router.post('/labels/updateOne', controller.accounts.labels.updateOne)
router.get('/labels/findAll', controller.accounts.labels.findAll)

module.exports = router