const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const users = require(`${process.cwd()}/models/users`)
const exercises = require(`${process.cwd()}/models/exercises`)
const { CustomError } = require(`${process.cwd()}/utils/error`)

router.get('/', async (req, res, next) => {
    try {
        // build database query
        let db_criteria = [{
            $eq: ['$user_id', new mongoose.Types.ObjectId(res.locals.user_id)]
        }]

        let data_facet = [{
            $project: {
                user_id: false,
                _id: false
            }
        }]

        if (!!req.query.from) {
            if (!isNaN(new Date(req.query.from))){
                db_criteria.push({
                    $gte: ['$date', new Date(req.query.from)]
                })   
            } else {
                throw new CustomError(400, 'invalid parameter - [from]')
            }
        }

        if (!!req.query.to) {
            if (!isNaN(new Date(req.query.to))){
                db_criteria.push({
                    $lte: ['$date', new Date(req.query.to)]
                })   
            } else {
                throw new CustomError(400, 'invalid parameter - [to]')
            }
        }

        if (!!req.query.limit) {
            let limit = Number.parseInt(req.query.limit)
            if (limit > 0) {
                data_facet.push({
                    $limit: limit
                })
            } else {
                throw new CustomError(400, 'invalid parameter - [limit]')
            }
        }


        // query database
        let exercise_doc = await exercises.aggregate([
            {
                $match: {
                    $expr: {
                        $and: db_criteria
                    }
                }
            },
            {
                $facet: {
                    count: [{ $count: 'count' }],
                    data: data_facet
                }
            },
            {
                $unwind: '$count'
            },
            {
                $project: {
                    count: '$count.count',
                    data: true,
                }
            }
        ])

        // create output
        if (exercise_doc.length == 0) {
            exercise_doc = [{
                count: 0,
                data: []
            }]
        }

        let user_doc = await users.findOne({ _id: res.locals.user_id })
        user_doc = user_doc.toObject()
        user_doc.count = exercise_doc[0].count
        user_doc.exercises = exercise_doc[0].data

        // send response
        res.json(user_doc)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        // check required input
        for (let param of ['description', 'duration']) {
            if (!req.body[param]) {
                throw new CustomError(400, `missing required parameter - ${param}`)
            }
        }

        if (isNaN(req.body.duration)) {
            throw new CustomError(400, 'invalid duration - expected number of minutes')
        }

        if (!!req.body.date && isNaN(new Date(req.body.date))) {
            throw new CustomError(400, 'invalid date')
        }

        // insert record
        let input = {
            user_id: res.locals.user_id,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date || new Date()
        }

        let user_doc = await users.findOne({_id: res.locals.user_id})
        let exercise_doc = await exercises.create(input)

        // create output
        let output = {
            _id: user_doc._id,
            username: user_doc.username,
            description: exercise_doc.description,
            duration: exercise_doc.duration,
            date: exercise_doc.date,
        }

        // send response
        res.status(201).json(output)
    } catch (err) {
        next(err)
    }
})

module.exports = router