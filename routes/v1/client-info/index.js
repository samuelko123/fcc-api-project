const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json({
        ipaddress: req.headers['x-forwarded-for'],
        language: req.headers['accept-language'],
        software: req.headers['user-agent']
    })
})

module.exports = router