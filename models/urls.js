const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    url_id: { type: Number, required: true },
    url_text: { type: String, required: true },
}, { versionKey: false })

module.exports = mongoose.model('urls', schema, 'urls')