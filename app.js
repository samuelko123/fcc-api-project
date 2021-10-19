const dotenv = require('dotenv')
const express = require('express')
const responseTime = require('response-time')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const swaggerUi = require("swagger-ui-express")
const { CustomError } = require(`${process.cwd()}/utils/error`)
const empty = require(`${process.cwd()}/utils/empty`)

// read .env file
dotenv.config()

// initialize Express
const app = express()
app.use(helmet())
app.use(cors())
app.use(responseTime())
app.use(rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000 // 1,000 requests per IP
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Home page => API Documentation
app.get('/', (req, res, next) => {
    res.redirect('/docs')
})

// API route
app.use('/api', require('./routes'))

// Documentation route
app.get('/docs/openapi.json', (req, res, next) => {
    res.json(require('./docs/openapi.json'))
})

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
        customSiteTitle: 'Test API',
        swaggerOptions: {
            url: '/docs/openapi.json'
        }
    })
)

// Test route (useful for mocking)
app.use((req, res, next) => {
    empty.empty_fn()
    next()
})

// 'Not Found' route
app.use((req, res, next) => {
    next(new CustomError(404, 'Not Found'))
})

// Error route
app.use((err, req, res, next) => {
    let status = err.status || 500
    if (status >= 500 && status < 600) {
        console.error(err.stack)
    }

    res
        .status(status)
        .json({ 'error': err.message })
})

module.exports = app