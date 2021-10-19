const express = require('express')
const router = express.Router()
const valid_url = require('valid-url')
const urls = require(`${process.cwd()}/models/urls`)
const counter = require(`${process.cwd()}/models/counter`)
const { CustomError } = require(`${process.cwd()}/utils/error`)

router.post('/', async (req, res, next) => {
    let long_url = req.body.url

    try {
        // check url
        if (!valid_url.isWebUri(long_url)) {
            throw new CustomError(400, 'Invalid URL')
        }

        // insert record into db
        let count_doc = await counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { upsert: true, new: true })
        let url_id = count_doc.count
        let url_doc = await urls.create({ url_id: url_id, url_text: long_url })

        // send response
        res.status(201).json({
            _id: url_doc._id,
            original_url: url_doc.url_text,
            short_url: url_doc.url_id
        })
    } catch (err) {
        next(err)
    }
})

router.get('/:url_id', async (req, res, next) => {
    try {
        // find the url
        let url_doc = await urls.findOne({ url_id: req.params.url_id })
        if (!url_doc) {
            throw new CustomError(404, 'URL does not exist')
        }

        // redirects client
        res.redirect(url_doc.url_text)
    } catch (err) {
        next(err)
    }
})

module.exports = router