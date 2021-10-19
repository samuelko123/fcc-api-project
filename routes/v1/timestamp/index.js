const express = require('express')
const router = express.Router()
const date_util = require(`${process.cwd()}/utils/date`)
// const controller = require(`${process.cwd()}/controllers/timestamp`)
const { CustomError } = require(`${process.cwd()}/utils/error`)

router.get('/', (req, res, next) => {
    try {
        // create a Date object of current time
        let date = new Date(Date.now())

        // convert date to timestamp
        let result = date_util.date_to_timestamp(date)

        // send response
        res.json(result)
    } catch (err) {
        next(err)
    }
})

router.get('/:date_string', (req, res, next) => {
    try {
        // convert string to date
        let date = date_util.string_to_date(req.params.date_string)

        // throw error for invalid date
        if (isNaN(date)) {
            throw new CustomError(400, 'Invalid Date')
        }

        // convert date to timestamp
        let result = date_util.date_to_timestamp(date)

        // send response
        res.json(result)
    } catch (err) {
        next(err)
    }
})

module.exports = router