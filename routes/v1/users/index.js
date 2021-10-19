const express = require('express')
const router = express.Router()
const users = require(`${process.cwd()}/models/users`)
const { CustomError } = require(`${process.cwd()}/utils/error`)

router.use('/:user_id/exercises', check_user_id_exists, require('./exercises'))

router.post('/', async (req, res, next) => {
    let user_doc
    let data = { username: req.body.username }
    try {
        // check username
        if (!req.body.username) {
            throw new CustomError(400, 'invalid username')
        }

        if (await users.exists(data)) {
            throw new CustomError(400, `username already exists - ${req.body.username}`)
        }

        // insert record
        user_doc = await users.create(data)
        res.status(201).json(user_doc)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        let user_docs = await users.find({})
        res.json(user_docs)
    } catch (err) {
        next(err)
    }
})

async function check_user_id_exists(req, res, next) {
    try {
        let user_exists = await users.exists({_id: req.params.user_id})
        if (!user_exists) {
            throw new CustomError(400, 'user does not exist')
        }
        res.locals.user_id = req.params.user_id

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = router