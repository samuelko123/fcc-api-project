const app = require('./app')
const db = require('./db')

// Regenerate documentation
require('./doc_gen')

// Connect to DB
if (process.env.NODE_ENV !== 'production') {
    const mongoose = require('mongoose')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    MongoMemoryServer
        .create()
        .then(mongo_server => mongo_server.getUri())
        .then(uri => db.connect(uri))
} else {
    db.connect(process.env.MONGO_URI)
}


// Start the Express server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})