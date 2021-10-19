const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    count: { type: Number, required: true, default: 0 },
}, { versionKey: false })

module.exports = mongoose.model('counter', schema, 'counter')