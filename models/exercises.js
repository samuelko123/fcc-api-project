const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: false },
}, { versionKey: false })

module.exports = mongoose.model('exercises', schema, 'exercises')