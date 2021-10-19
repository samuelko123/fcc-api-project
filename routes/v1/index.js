const express = require('express')
const router = express.Router()

router.use('/file-analyse', require('./file-analyse'))
router.use('/short-url', require('./short-url'))
router.use('/timestamp', require('./timestamp'))
router.use('/users', require('./users'))
router.use('/client-info', require('./client-info'))

module.exports = router