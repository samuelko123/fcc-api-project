const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: { type: String, required: true },
}, { versionKey: false })

module.exports = mongoose.model('users', schema, 'users')